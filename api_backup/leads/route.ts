import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { generateLeadPDF } from "@/lib/pdf";
import { sendEmail, buildLeadEmailHTML } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, projectType, dimensions, notes, answers, budget, filesUrls } = body;

    // ═══ Step A: Save to Database ═══
    let leadId = null;
    try {
      const { data: lead, error } = await supabase
        .from("leads")
        .insert({
          client_name: name || "Без імені",
          client_contact: phone || "",
          project_topic: projectType || "Загальна заявка",
          budget_range: budget || null,
          notes: notes || null,
          files_url: filesUrls || [],
          details: { answers: answers || {}, dimensions: dimensions || '' },
          status: "new",
        })
        .select()
        .single();

      if (error) console.error("DB error:", error.message);
      else leadId = lead?.id;
    } catch (dbErr) {
      console.error("DB catch error:", dbErr);
    }

    // ═══ Step B: Generate branded PDF ═══
    let pdfBuffer = null;
    try {
      pdfBuffer = await generateLeadPDF({
        name: name || "Без імені",
        phone: phone || "—",
        projectType: projectType || "—",
        dimensions: dimensions || "",
        notes: notes || "",
        answers: answers || {},
      });
    } catch (pdfErr) {
      console.error("PDF Gen error:", pdfErr);
    }

    const pdfFilename = `Заявка_${(name || "client").replace(/\s+/g, "_")}_${Date.now()}.pdf`;

    // ═══ Step C: Send Email with PDF ═══
    const adminEmail = process.env.ADMIN_EMAIL || "meblipro2025@gmail.com";
    try {
      await sendEmail({
        to: adminEmail,
        subject: `🚀 Нова заявка: ${projectType} — ${name}`,
        html: buildLeadEmailHTML({ name, phone, projectType, notes }),
        pdfBuffer: pdfBuffer || undefined,
        pdfFilename,
      });
    } catch (emailErr) {
      console.error("Email send error (SMTP issue?):", emailErr);
    }

    // ═══ Step D: Send to Telegram with PDF document ═══
    const botToken = process.env.BOT_TOKEN;
    const chatId = process.env.ADMIN_CHAT_ID;

    if (botToken && chatId && chatId !== "YOUR_PERSONAL_CHAT_ID") {
      try {
        // HTML notification with clickable phone + inline button
        let html =
          `🚀 <b>НОВА ЗАЯВКА</b>\n\n` +
          `📋 <b>${projectType}</b>\n` +
          `👤 ${name || '—'}\n` +
          `📱 <a href="tel:${phone}">${phone}</a>\n` +
          (budget ? `💰 Бюджет: <b>${budget}</b>\n` : "") +
          (notes ? `📝 ${notes}\n` : "") +
          (dimensions ? `📐 ${dimensions}\n` : "");

        // Add answers details
        if (answers && typeof answers === 'object') {
          html += `\n── <b>Деталі</b> ──\n`;
          for (const [k, v] of Object.entries(answers)) {
            if (!['name', 'phone'].includes(k)) html += `• <i>${k}</i>: ${v}\n`;
          }
        }

        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: Number(chatId),
            text: html,
            parse_mode: "HTML",
            reply_markup: {
              inline_keyboard: [[
                { text: "💬 Написати клієнту", url: "https://t.me/devcraft_ua" }
              ]]
            }
          }),
        });

        // PDF document
        if (pdfBuffer) {
          const formData = new FormData();
          formData.append("chat_id", chatId);
          formData.append("caption", `📄 ${pdfFilename}`);
          formData.append("document", new Blob([new Uint8Array(pdfBuffer)], { type: "application/pdf" }), pdfFilename);

          await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, {
            method: "POST",
            body: formData,
          });
        }

        // Contact card
        if (phone) {
          await fetch(`https://api.telegram.org/bot${botToken}/sendContact`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: Number(chatId), phone_number: phone, first_name: name || "Клієнт" }),
          });
        }
      } catch (tgErr) {
        console.error("TG error:", tgErr);
      }
    }

    return NextResponse.json({
      success: true,
      leadId: leadId,
      message: "Заявку отримано! Майстер зв'яжеться з вами протягом 1 години.",
    });
  } catch (err: any) {
    console.error("Lead API error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function GET() {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
