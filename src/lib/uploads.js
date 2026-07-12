import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const MAX_UPLOAD_BYTES = 6 * 1024 * 1024;

const ALLOWED_TYPES = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/gif", ".gif"],
  ["application/pdf", ".pdf"],
]);

function safeSegment(value) {
  return String(value || "shared").replace(/[^a-zA-Z0-9_-]/g, "-");
}

export async function saveLocalUpload(file, organizationId) {
  if (!file || typeof file.arrayBuffer !== "function" || file.size === 0) {
    return null;
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("Upload must be 6MB or smaller.");
  }

  const extension = ALLOWED_TYPES.get(file.type);
  if (!extension) {
    throw new Error("Upload must be an image or PDF.");
  }

  const orgSegment = safeSegment(organizationId);
  const filename = `${Date.now()}-${randomUUID()}${extension}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", orgSegment);
  const uploadPath = path.join(uploadDir, filename);

  await mkdir(uploadDir, { recursive: true });
  await writeFile(uploadPath, Buffer.from(await file.arrayBuffer()));

  return `/uploads/${orgSegment}/${filename}`;
}
