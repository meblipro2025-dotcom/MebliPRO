import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { generateLeadPDF } from "@/lib/pdf";
import { sendEmail, buildLeadEmailHTML } from "@/lib/email";

interface LeadRequestBody {
  name?: string;
  phone?: string;
  projectType?: string;
  dimensions?: string;
  notes?: string;
  answers?: Record<string, string | number | boolean>;
  budget?: string;
  filesUrls?: string[];
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as LeadRequestBody;
    const { name, phone, projectType, dimensions, notes, answers, budget, filesUrls } = body;

    const normalizedAnswers: Record<string, string> = {};
    if (answers) {
      for (const [key, value] of Object.entries(answers)) {
        normalizedAnswers[key] = String(value);
      }
    }

    const safeName = name || "Без імені";
    const safePhone = phone || "—";
    const safeProjectType = projectType || "Загальна заявка";

    let leadId: string | null = null;

    try {
      const { data: lead, error } = await supabase
        .from("leads")
        .insert({
          client_name: safeName,
          client_contact: phone || "",
          project_topic: safeProjectType,
          budget_range: budget || null,
          notes: notes || null,
          files_url: filesUrls || [],
          details: { answers: normalizedAnswers, dimensions: dimensions || "" },
          status: "new",
        })
        .select()
        .single();

      if (error) {
        console.error("DB error:", error.message);
      } else {
        leadId = String(lead?.id ?? "");
      }
    } catch (error) {
      console.error("DB catch error:", error);
    }

    let pdfBuffer: Buffer | null = null;
    try {
      pdfBuffer = await generateLeadPDF({
        name: safeName,
        phone: safePhone,
        projectType: safeProjectType,
        dimensions: dimensions || "",
        notes: notes || "",
        answers: normalizedAnswers,
      });
    } catch (error) {
      console.error("PDF Gen error:", error);
    }

    const pdfFilename = `Заявка_${(name || "client").replace(/\s+/g, "_")}_${Date.now()}.pdf`;
    const adminEmail = process.env.ADMIN_EMAIL || "meblipro2025@gmail.com";

    try {
      await sendEmail({
        to: adminEmail,
        subject: `🚀 Нова заявка: ${safeProjectType} — ${safeName}`,
        html: buildLeadEmailHTML({ name: safeName, phone: safePhone, projectType: safeProjectType, notes }),
        pdfBuffer: pdfBuffer || undefined,
        pdfFilename,
      });
    } catch (error) {
      console.error("Email send error:", error);
    }

    const botToken = process.env.BOT_TOKEN;
    const chatId = process.env.ADMIN_CHAT_ID;

    if (botToken && chatId) {
      try {
        let tgHtml = `<b>✨ НОВА ЗАЯВКА - MEBLI-PRO</b>\n`;
        tgHtml += `━━━━━━━━━━━━━━━━━\n`;
        tgHtml += `👤 <b>Клієнт:</b> ${safeName}\n`;
        tgHtml += `📞 <b>Телефон:</b> <code>${safePhone}</code>\n`;
        tgHtml += `📂 <b>Послуга:</b> ${safeProjectType}\n`;
        
        if (dimensions && dimensions !== 'Д:- Ш:- В:-') {
            tgHtml += `📐 <b>Габарити:</b> ${dimensions}\n`;
        }
        
        if (budget) tgHtml += `💰 <b>Бюджет:</b> ${budget}\n`;
        
        if (Object.keys(normalizedAnswers).length > 0) {
          tgHtml += `\n<b>📋 ОПИТУВАЛЬНИК:</b>\n`;
          for (const [key, value] of Object.entries(normalizedAnswers)) {
            tgHtml += `◾️ <i>${key}:</i> ${value}\n`;
          }
        }

        if (notes) {
          tgHtml += `\n<b>📝 КОМЕНТАР:</b>\n<i>${notes}</i>\n`;
        }
        
        if (filesUrls && filesUrls.length > 0) {
            tgHtml += `\n<b>📎 ФАЙЛИ:</b> ${filesUrls.length} шт.\n`;
        }

        tgHtml += `━━━━━━━━━━━━━━━━━\n`;
        tgHtml += `👉 <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin">Відкрити в Адмін-панелі</a>\n`;
        tgHtml += `⏰ ${new Date().toLocaleString('uk-UA', { timeZone: 'Europe/Kiev' })}`;

        // Main Message
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: tgHtml,
            parse_mode: "HTML",
            disable_web_page_preview: true,
            reply_markup: {
              inline_keyboard: [
                [
                  { text: "📞 Зателефонувати", url: `tel:${safePhone}` },
                  { text: "💬 Viber", url: `viber://add?number=${safePhone.replace(/\D/g,'')}` }
                ],
                [
                  { text: "⚡️ WhatsApp", url: `https://wa.me/${safePhone.replace(/\D/g,'')}` },
                  { text: "📱 Telegram", url: `https://t.me/${safePhone.replace(/\D/g,'')}` }
                ]
              ],
            },
          }),
        });

        // PDF Document
        if (pdfBuffer) {
          const pdfData = new FormData();
          pdfData.append("chat_id", chatId);
          pdfData.append("document", new Blob([new Uint8Array(pdfBuffer)], { type: "application/pdf" }), pdfFilename);
          pdfData.append("caption", "📄 Детальний PDF-проєкт заявки");
          await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, { method: "POST", body: pdfData });
        }

        // Native Contact
        if (phone && /^\+?\d{9,15}$/.test(phone.replace(/\s+/g,''))) {
          await fetch(`https://api.telegram.org/bot${botToken}/sendContact`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: chatId,
              phone_number: phone,
              first_name: safeName,
            }),
          });
        }
      } catch (error) {
        console.error("TG catch error:", error);
      }
    }

    return NextResponse.json({ success: true, leadId });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function GET() {
  const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
