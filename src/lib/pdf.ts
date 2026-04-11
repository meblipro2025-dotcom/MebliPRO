import puppeteer from "puppeteer";
import { translateKey, translateValue } from "@/lib/fieldLabels";

interface LeadData {
  name: string;
  phone: string;
  projectType: string;
  dimensions?: string;
  notes?: string;
  answers?: Record<string, string>;
  date?: string;
}

export async function generateLeadPDF(data: LeadData): Promise<Buffer> {
  const now = data.date || new Date().toLocaleString("uk-UA", { dateStyle: "long", timeStyle: "short" });

  let answersHtml = "";
  if (data.answers && Object.keys(data.answers).length > 0) {
    let i = 0;
    for (const [key, val] of Object.entries(data.answers)) {
      if (["name", "phone"].includes(key)) continue;
      const bg = i % 2 === 0 ? 'background: #191919;' : 'background: transparent;';
      answersHtml += `
        <tr style="${bg}">
          <td style="padding: 10px; color: #8c8c8c; text-transform: uppercase; font-size: 11px; letter-spacing: 1px;">${translateKey(key)}</td>
          <td style="padding: 10px; color: #ffffff;">${translateValue(String(val))}</td>
        </tr>
      `;
      i++;
    }
  }

  const html = `
    <!DOCTYPE html>
    <html lang="uk">
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          margin: 0;
          padding: 0;
          background-color: #141414;
          color: #ffffff;
          font-family: 'Arial', sans-serif;
          /* fallback to Arial for cyrillic */
        }
        .container {
          padding: 40px;
        }
        .header {
          border-bottom: 2px solid #d4af37;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .logo {
          color: #d4af37;
          font-size: 36px;
          font-weight: bold;
          margin: 0;
        }
        .subtitle {
          color: #8c8c8c;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-top: 5px;
        }
        .top-bar {
          height: 6px;
          background-color: #d4af37;
          width: 100%;
          position: absolute;
          top: 0;
          left: 0;
        }
        .title-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }
        .title {
          font-size: 24px;
          margin: 0;
        }
        .date {
          color: #8c8c8c;
          font-size: 14px;
        }
        .client-card {
          background-color: #1e1e1e;
          border-radius: 8px;
          padding: 20px;
          display: flex;
          justify-content: space-between;
          margin-bottom: 40px;
        }
        .client-field {
          flex: 1;
        }
        .label {
          color: #d4af37;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 8px;
          font-weight: bold;
        }
        .value {
          font-size: 18px;
        }
        .section-title {
          color: #d4af37;
          font-size: 18px;
          border-bottom: 1px solid #323232;
          padding-bottom: 10px;
          margin-bottom: 20px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        .footer {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          background-color: #d4af37;
          color: #141414;
          text-align: center;
          padding: 10px 0;
          font-size: 12px;
          font-weight: bold;
        }
        .data-group { margin-bottom: 20px; }
      </style>
    </head>
    <body>
      <div class="top-bar"></div>
      <div class="container">
        <div class="header">
          <h1 class="logo">MEBLI-PRO</h1>
          <div class="subtitle">МАЙСТЕРНЯ КОРПУСНИХ МЕБЛІВ | КИЇВ, ЛІВИЙ БЕРЕГ</div>
        </div>

        <div class="title-row">
          <h2 class="title">ЗАЯВКА НА ПРОРАХУНОК</h2>
          <div class="date">${now}</div>
        </div>

        <div class="client-card">
          <div class="client-field">
            <div class="label">Клієнт</div>
            <div class="value">${data.name || "—"}</div>
          </div>
          <div class="client-field">
            <div class="label">Телефон</div>
            <div class="value">${data.phone || "—"}</div>
          </div>
          <div class="client-field">
            <div class="label">Категорія</div>
            <div class="value">${data.projectType || "—"}</div>
          </div>
        </div>

        <h3 class="section-title">ДЕТАЛІ ЗАМОВЛЕННЯ</h3>
        
        ${answersHtml ? `<table><tbody>${answersHtml}</tbody></table>` : ''}

        ${data.dimensions ? `
          <div class="data-group">
            <div class="label">РОЗМІРИ</div>
            <div style="color: #cccccc;">${data.dimensions}</div>
          </div>
        ` : ''}

        ${data.notes ? `
          <div class="data-group" style="margin-top: 20px;">
            <div class="label">ПРИМІТКИ</div>
            <div style="color: #cccccc; line-height: 1.5;">${data.notes}</div>
          </div>
        ` : ''}
      </div>

      <div class="footer">
        +380 93 143 18 43 &nbsp;|&nbsp; @devcraft_ua &nbsp;|&nbsp; www.meblipro.pp.ua
      </div>
    </body>
    </html>
  `;

  // Start puppeteer and generate PDF
  const browser = await puppeteer.launch({ 
    headless: true, 
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  });
  
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ 
      format: 'A4', 
      printBackground: true,
      margin: { top: '0', bottom: '0', left: '0', right: '0' }
    });
    return Buffer.from(pdfBuffer);
  } finally {
    await browser.close();
  }
}

