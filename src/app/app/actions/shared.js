import { nextAssetTag as getNextAssetTag } from "@/lib/data";

export function value(formData, name) {
  return String(formData.get(name) || "").trim();
}

export async function nextAssetTag() {
  return getNextAssetTag();
}
