import { Body, Controller, Post, Res } from "@nestjs/common";
import type { Response } from "express";
import { PdfService } from "./pdf.service";

// Unauthenticated: the client posts the resume it holds locally and gets a PDF back.
// Nothing is persisted server-side.
@Controller("resume")
export class PdfController {
  constructor(private readonly pdf: PdfService) {}

  @Post("pdf")
  async exportPdf(@Body() body: { data: unknown }, @Res() res: Response) {
    const buf = await this.pdf.renderData(body.data);
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="resume.pdf"',
    });
    res.end(buf);
  }
}
