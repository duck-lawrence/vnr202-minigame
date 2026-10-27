import { readFile, readdir, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { extractText, getDocumentProxy } from "unpdf";

async function findPdf() {
  const explicit = process.argv[2];
  if (explicit) {
    return path.resolve(explicit);
  }
  const docsDir = path.resolve("docs");
  const entries = await readdir(docsDir);
  const pdf = entries.find((entry) => entry.toLowerCase().endsWith(".pdf"));
  if (!pdf) {
    throw new Error("Không tìm thấy PDF trong docs/. Truyền đường dẫn PDF làm tham số.");
  }
  return path.join(docsDir, pdf);
}

async function main() {
  const file = await findPdf();
  const buffer = await readFile(file);
  const pdf = await getDocumentProxy(new Uint8Array(buffer));
  const { totalPages, text } = await extractText(pdf, { mergePages: false });
  const pages = Array.isArray(text) ? text : [text];

  const outDir = path.resolve("tmp/pdf-pages");
  await mkdir(outDir, { recursive: true });

  for (let index = 0; index < pages.length; index += 1) {
    const pageNumber = String(index + 1).padStart(3, "0");
    await writeFile(
      path.join(outDir, `page-${pageNumber}.txt`),
      pages[index] ?? "",
      "utf8",
    );
  }

  await writeFile(
    path.resolve("tmp/pdf-text.txt"),
    pages
      .map((page, index) => `===== PDF PAGE ${index + 1} =====\n${page ?? ""}`)
      .join("\n\n"),
    "utf8",
  );

  console.log(`Đã trích ${totalPages} trang từ ${path.basename(file)}.`);
  console.log("Xem tmp/pdf-text.txt hoặc từng trang trong tmp/pdf-pages/.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
