import Counter from "@/models/Counter";

export function value(formData, name) {
  return String(formData.get(name) || "").trim();
}

export async function nextAssetTag() {
  const counter = await Counter.findOneAndUpdate(
    { name: "assetTag" },
    { $inc: { value: 1 } },
    { new: true, upsert: true },
  );

  return `ORB-${String(counter.value).padStart(4, "0")}`;
}
