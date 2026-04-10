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
      console.error("Email send error (SMTP issue?):", error);
    }

    const botToken = process.env.BOT_TOKEN;
    const chatId = process.env.ADMIN_CHAT_ID;

    if (botToken && chatId && chatId !== "YOUR_PERSONAL_CHAT_ID") {
      try {
        let html =
          `🚀 <b>НОВА ЗАЯВКА</b>\n\n` +
          `📋 <b>${safeProjectType}</b>\n` +
          `👤 ${safeName}\n` +
          `📱 <a href="tel:${safePhone}">${safePhone}</a>\n` +
          (budget ? `💰 Бюджет: <b>${budget}</b>\n` : "") +
          (notes ? `📝 ${notes}\n` : "") +
          (dimensions ? `📐 ${dimensions}\n` : "");

        if (Object.keys(normalizedAnswers).length > 0) {
          html += `\n── <b>Деталі</b> ──\n`;
          for (const [key, value] of Object.entries(normalizedAnswers)) {
            if (!['name', 'phone'].includes(key)) {
              html += `• <i>${key}</i>: ${value}\n`;
            }
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
                { text: "💬 Написати клієнту", url: "https://t.me/devcraft_ua" },
              ]],
            },
          }),
        });

        if (pdfBuffer) {
          const formData = new FormData();
          formData.append("chat_id", chatId);
          formData.append("caption", `📄 ${pdfFilename}`);
          formData.append(
            "document",
            new Blob([new Uint8Array(pdfBuffer)], { type: "application/pdf" }),
            pdfFilename,
          );

          await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, {
            method: "POST",
            body: formData,
          });
        }

        if (phone) {
          await fetch(`https://api.telegram.org/bot${botToken}/sendContact`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: Number(chatId),
              phone_number: phone,
              first_name: safeName,
            }),
          });
        }
      } catch (error) {
        console.error("TG error:", error);
      }
    }

    return NextResponse.json({
      success: true,
      leadId,
      message: "Заявку отримано! Майстер зв'яжеться з вами протягом 1 години.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Lead API error:", error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function GET() {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
