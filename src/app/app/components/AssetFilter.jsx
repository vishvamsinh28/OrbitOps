"use client";

import { useMemo, useState } from "react";

const ASSET_STATUSES = [
  "Available", "Allocated", "Reserved", "Under Maintenance",
  "Lost", "Retired", "Disposed",
];

export function AssetFilter({ assets, categories, canManage }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return assets.filter((asset) => {
      if (q && !asset.assetTag.toLowerCase().includes(q) &&
          !asset.name.toLowerCase().includes(q) &&
          !(asset.serialNumber || "").toLowerCase().includes(q) &&
          !(asset.location || "").toLowerCase().includes(q)) {
        return false;
      }
      if (statusFilter && asset.status !== statusFilter) return false;
      if (categoryFilter && (asset.category?._id || "") !== categoryFilter) return false;
      return true;
    });
  }, [assets, search, statusFilter, categoryFilter]);

  return (
    <div>
      <div className="mb-4 grid gap-3 min-[600px]:grid-cols-[1fr_160px_160px]">
        <input
          type="search"
          placeholder="Search by tag, name, serial, or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-md border border-[rgba(148,168,210,0.2)] bg-[#0D1220] px-3 py-2 text-sm text-[#E9EDF6] placeholder:text-[#586180]"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border border-[rgba(148,168,210,0.2)] bg-[#0D1220] px-3 py-2 text-sm text-[#E9EDF6]"
        >
          <option value="">All statuses</option>
          {ASSET_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-md border border-[rgba(148,168,210,0.2)] bg-[#0D1220] px-3 py-2 text-sm text-[#E9EDF6]"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-4">
        {filtered.length === 0 ? (
          <p className="text-sm text-[#8B98B4]">No matching assets.</p>
        ) : (
          filtered.map((asset) => (
            <article
              key={asset._id}
              className="grid gap-2 border-b border-white/10 pb-4 min-[760px]:grid-cols-[1fr_auto]"
            >
              <div>
                <p className="font-medium">
                  {asset.assetTag} — {asset.name}
                </p>
                <p className="text-sm text-[#8B98B4]">
                  {asset.category?.name || "Uncategorized"} · {asset.status} ·{" "}
                  {asset.location || "No location"}
                  {asset.serialNumber ? ` · S/N: ${asset.serialNumber}` : null}
                </p>
              </div>
              <div className="flex items-start gap-2">
                {canManage ? (
                  <a
                    href={`/app/assets/${asset._id}/edit`}
                    className="rounded-md border border-white/10 px-3 py-1 font-mono text-xs text-[#8B98B4] hover:text-[#E9EDF6]"
                  >
                    Edit
                  </a>
                ) : null}
                <span className="self-start rounded-md border border-white/10 px-3 py-1 font-mono text-xs text-[#8B98B4]">
                  {asset.isBookable ? "Bookable" : "Asset"}
                </span>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
