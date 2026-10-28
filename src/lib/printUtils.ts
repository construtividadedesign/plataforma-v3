/**
 * Utilitário profissional de impressão e geração de PDF para A4
 * Isola o conteúdo HTML em um iframe limpo e injeta estilos normalizados de impressão,
 * evitando páginas em branco, conflitos de modo escuro e cortes por overflow.
 */

export interface PrintOptions {
  title?: string;
  pageMargin?: string;
  landscape?: boolean;
  styles?: string;
}

export function printElementById(elementId: string, options?: PrintOptions): boolean {
  if (typeof window === "undefined") return false;

  const target = document.getElementById(elementId);
  if (!target) {
    console.warn(`Elemento com id "${elementId}" não encontrado para impressão. Recorrendo a window.print()`);
    window.print();
    return false;
  }

  return printHtml(target.innerHTML, options);
}

export function printHtml(contentHtml: string, options?: PrintOptions): boolean {
  if (typeof window === "undefined") return false;

  const title = options?.title || "Documento Técnico Oficial • Plataforma de Climatização";
  const pageMargin = options?.pageMargin || "12mm 10mm";
  const orientation = options?.landscape ? "landscape" : "portrait";

  // Remove qualquer iframe de impressão remanescente
  const existingIframe = document.getElementById("__print_engine_iframe__");
  if (existingIframe && existingIframe.parentNode) {
    existingIframe.parentNode.removeChild(existingIframe);
  }

  // Cria um iframe temporário invisível no mesmo domínio
  const iframe = document.createElement("iframe");
  iframe.id = "__print_engine_iframe__";
  iframe.setAttribute("aria-hidden", "true");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  iframe.style.opacity = "0";
  iframe.style.pointerEvents = "none";
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    window.print();
    return false;
  }

  // Clona os estilos ativos do documento principal para manter o Tailwind funcionando
  let activeStyles = "";
  try {
    const styleTags = document.querySelectorAll("style, link[rel='stylesheet']");
    styleTags.forEach((tag) => {
      activeStyles += tag.outerHTML + "\n";
    });
  } catch (e) {
    console.warn("Não foi possível copiar folhas de estilo:", e);
  }

  // Regras de formatação A4 rígidas e à prova de falhas
  const normalizedPrintCss = `
    @page {
      size: A4 ${orientation};
      margin: ${pageMargin};
    }

    *, *::before, *::after {
      box-sizing: border-box !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }

    html, body {
      margin: 0 !important;
      padding: 0 !important;
      background: #ffffff !important;
      color: #0f172a !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
      font-size: 10.5pt;
      line-height: 1.45;
      width: 100% !important;
      height: auto !important;
      min-height: auto !important;
      overflow: visible !important;
    }

    .no-print, [data-no-print] {
      display: none !important;
    }

    /* Prevenção de quebra de páginas em blocos de conteúdo */
    .break-inside-avoid,
    .print-break-inside-avoid,
    .dossier-card,
    .challenge-card,
    tr {
      break-inside: avoid !important;
      page-break-inside: avoid !important;
    }

    table {
      width: 100% !important;
      border-collapse: collapse !important;
      margin-top: 8px !important;
      margin-bottom: 8px !important;
    }

    th, td {
      border: 1px solid #cbd5e1 !important;
      padding: 6px 8px !important;
      text-align: left !important;
      font-size: 9pt !important;
    }

    th {
      background-color: #f1f5f9 !important;
      color: #0f172a !important;
      font-weight: 700 !important;
    }

    /* Cores de alto contraste para impressão profissional */
    .bg-white {
      background-color: #ffffff !important;
    }

    .bg-slate-50, .bg-slate-50\\/50 {
      background-color: #f8fafc !important;
    }

    .bg-slate-100 {
      background-color: #f1f5f9 !important;
    }

    .text-slate-900 {
      color: #0f172a !important;
    }

    .text-slate-800 {
      color: #1e293b !important;
    }

    .text-slate-700 {
      color: #334155 !important;
    }

    .text-slate-600 {
      color: #475569 !important;
    }

    .text-slate-500 {
      color: #64748b !important;
    }

    .border-slate-200 {
      border-color: #e2e8f0 !important;
    }

    .border-slate-300 {
      border-color: #cbd5e1 !important;
    }

    .border-red-600 {
      border-color: #dc2626 !important;
    }

    .text-red-600 {
      color: #dc2626 !important;
    }

    .text-red-700 {
      color: #b91c1c !important;
    }

    .bg-red-600 {
      background-color: #dc2626 !important;
      color: #ffffff !important;
    }

    .bg-red-500\\/10 {
      background-color: #fef2f2 !important;
    }

    .border-red-500\\/20 {
      border-color: #fecaca !important;
    }

    .text-red-400 {
      color: #dc2626 !important;
    }

    /* Container de conteúdo */
    .print-document-container {
      width: 100% !important;
      max-width: 100% !important;
      margin: 0 auto !important;
      padding: 0 !important;
      background: #ffffff !important;
    }

    ${options?.styles || ""}
  `;

  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html lang="pt-BR">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${title}</title>
        ${activeStyles}
        <style>
          ${normalizedPrintCss}
        </style>
      </head>
      <body>
        <div class="print-document-container">
          ${contentHtml}
        </div>
      </body>
    </html>
  `);
  doc.close();

  // Aguarda a aplicação dos estilos e imagens antes de invocar o diálogo
  setTimeout(() => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch (err) {
      console.error("Falha ao disparar impressão do iframe:", err);
      window.print();
    } finally {
      // Limpeza do iframe após 90 segundos para não interferir na sessão
      setTimeout(() => {
        if (iframe && iframe.parentNode) {
          iframe.parentNode.removeChild(iframe);
        }
      }, 90000);
    }
  }, 350);

  return true;
}
