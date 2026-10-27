import { mkdir, access } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { IMAGE_MANIFEST } from "./image-manifest.mjs";

const API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";
const OUT_DIR = path.resolve("public/images");
const MAX_REQUESTS = Number(readArg("max-requests") ?? 28);
const MODELS = [
  process.env.GEMINI_IMAGE_MODEL || "gemini-nano-banana-2.1",
  "gemini-3.1-flash-lite-image",
].filter((model, index, all) => model && all.indexOf(model) === index);

let requestCount = 0;

function readArg(name) {
  const prefix = `--${name}=`;
  const match = process.argv.slice(2).find((arg) => arg.startsWith(prefix));
  return match ? match.slice(prefix.length) : undefined;
}

function hasFlag(name) {
  return process.argv.slice(2).includes(`--${name}`);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function exists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

function redactError(error) {
  if (!error) {
    return "Lỗi không xác định";
  }
  const message = error instanceof Error ? error.message : String(error);
  return message.length > 500 ? `${message.slice(0, 500)}...` : message;
}

function parseApiError(status, payload) {
  const message =
    payload?.error?.message ||
    payload?.message ||
    `HTTP ${status}`;
  const error = new Error(message);
  error.status = status;
  return error;
}

async function requestImage(model, item) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Thiếu GEMINI_API_KEY trong môi trường. Chạy bằng npm run images:generate.");
  }
  requestCount += 1;
  if (requestCount > MAX_REQUESTS) {
    throw new Error(
      `Đã chạm giới hạn ${MAX_REQUESTS} request. Dừng để tránh vượt quota.`,
    );
  }

  const response = await fetch(`${API_BASE}/${model}:generateContent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": process.env.GEMINI_API_KEY,
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: item.prompt }] }],
      generationConfig: {
        responseModalities: ["TEXT", "IMAGE"],
        imageConfig: {
          aspectRatio: item.aspectRatio,
          imageSize: "1K",
        },
      },
    }),
    signal: AbortSignal.timeout(180_000),
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw parseApiError(response.status, payload);
  }

  const parts = payload?.candidates?.[0]?.content?.parts ?? [];
  const imagePart = parts.find((part) => part.inlineData || part.inline_data);
  const inline = imagePart?.inlineData ?? imagePart?.inline_data;
  if (!inline?.data) {
    const text = parts
      .map((part) => part.text)
      .filter(Boolean)
      .join(" ")
      .slice(0, 300);
    throw new Error(
      `API không trả về ảnh.${text ? ` Phản hồi: ${text}` : ""}`,
    );
  }
  return Buffer.from(inline.data, "base64");
}

async function generateWithFallback(item) {
  let lastError = null;
  for (const model of MODELS) {
    for (let attempt = 0; attempt <= 2; attempt += 1) {
      try {
        const buffer = await requestImage(model, item);
        return { buffer, model };
      } catch (error) {
        lastError = error;
        const status = error?.status;
        if (status === 404) {
          console.warn(`  Model ${model} không khả dụng, thử model dự phòng.`);
          break;
        }
        if (status === 429 || (typeof status === "number" && status >= 500)) {
          if (attempt < 2) {
            const delay = 2_000 * (attempt + 1);
            console.warn(
              `  Lỗi ${status}; thử lại sau ${delay / 1000}s (${attempt + 1}/2).`,
            );
            await sleep(delay);
            continue;
          }
        }
        throw error;
      }
    }
  }
  throw lastError ?? new Error("Không sinh được ảnh.");
}

async function main() {
  const only = readArg("only")
    ?.split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  const limit = Number(readArg("limit") ?? 0);
  const force = hasFlag("force");
  const dryRun = hasFlag("dry-run") || hasFlag("list");

  let items = IMAGE_MANIFEST.filter((item) => !only || only.includes(item.id));
  if (limit > 0) {
    items = items.slice(0, limit);
  }

  if (!items.length) {
    console.error("Không tìm thấy ảnh phù hợp với bộ lọc.");
    process.exitCode = 1;
    return;
  }

  console.log(
    `${items.length}/${IMAGE_MANIFEST.length} ảnh sẽ xử lý. Dự kiến tối đa ${items.length * 0.0336 < 0.01 ? "<$0.01" : `$${(items.length * 0.0336).toFixed(2)}`} cho 1K.`,
  );

  if (dryRun) {
    for (const item of items) {
      console.log(`- ${item.id} → public/images/${item.file} (${item.aspectRatio})`);
    }
    return;
  }

  if (!process.env.GEMINI_API_KEY) {
    console.error(
      "Thiếu GEMINI_API_KEY. Hãy điền key vào .env rồi chạy lại bằng npm run images:generate.",
    );
    process.exitCode = 1;
    return;
  }

  await mkdir(OUT_DIR, { recursive: true });
  let failed = 0;

  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];
    const destination = path.join(OUT_DIR, item.file);
    if (!force && (await exists(destination))) {
      console.log(`[${index + 1}/${items.length}] ${item.id}: đã có, bỏ qua.`);
      continue;
    }

    try {
      console.log(`[${index + 1}/${items.length}] ${item.id}: đang sinh...`);
      const { buffer, model } = await generateWithFallback(item);
      await mkdir(path.dirname(destination), { recursive: true });
      await sharp(buffer)
        .resize(item.width, item.height, {
          fit: "cover",
          position: "attention",
        })
        .webp({ quality: 86 })
        .toFile(destination);
      console.log(
        `[${index + 1}/${items.length}] ${item.id}: xong (${model}) → ${item.file}`,
      );
      await sleep(1_500);
    } catch (error) {
      failed += 1;
      console.error(
        `[${index + 1}/${items.length}] ${item.id}: lỗi - ${redactError(error)}`,
      );
      if (error?.status === 403 || error?.status === 429) {
        console.error(
          "Dừng batch vì lỗi quyền/quota. Kiểm tra billing hoặc chờ quota rồi chạy lại; các ảnh đã có sẽ được bỏ qua.",
        );
        break;
      }
    }
  }

  console.log(
    `Hoàn tất. Đã dùng ${requestCount} request.${failed ? ` ${failed} ảnh lỗi.` : ""}`,
  );
  if (failed) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(`Lỗi: ${redactError(error)}`);
  process.exitCode = 1;
});
