import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { type Browser, chromium } from "playwright";

@Injectable()
export class PdfService implements OnModuleDestroy {
  private browser?: Browser;

  private async get(): Promise<Browser> {
    if (!this.browser || !this.browser.isConnected()) {
      this.browser = await chromium.launch();
    }
    return this.browser;
  }

  // Inject the posted resume as window.__RESUME__ (before page scripts run), then render
  // the print route — which reads that global — to an A4 PDF.
  async renderData(data: unknown): Promise<Buffer> {
    const ctx = await (await this.get()).newContext();
    const page = await ctx.newPage();
    try {
      await page.addInitScript((d) => {
        (window as unknown as { __RESUME__: unknown }).__RESUME__ = d;
      }, data);
      const url = `${process.env.PUBLIC_WEB_URL}/resume/export/print`;
      await page.goto(url, { waitUntil: "networkidle" });
      await page.evaluate(
        () =>
          (document as unknown as { fonts: { ready: Promise<unknown> } }).fonts
            .ready,
      );
      // wait until the client-side paginator has laid out the A4 page sheets
      await page
        .waitForFunction(
          () => document.documentElement.getAttribute("data-paginated") === "1",
          {
            timeout: 10_000,
          },
        )
        .catch(() => undefined);
      // page sheets are exact A4 with their own 14mm padding -> zero PDF margin
      return await page.pdf({
        format: "A4",
        printBackground: true,
        margin: { top: "0", right: "0", bottom: "0", left: "0" },
      });
    } finally {
      await ctx.close();
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.browser?.close();
  }
}
