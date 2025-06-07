import { pdfjs } from "react-pdf";
import { PDFDocument } from "pdf-lib";

import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

// Configure the worker source for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "/pdf.worker.js",
  import.meta.url,
).toString();

export { PDFDocument };
