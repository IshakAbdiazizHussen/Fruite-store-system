"use client";

import React, { useMemo } from "react";
import { FileText, TrendingUp, Calendar, Download } from "lucide-react";
import { reports } from "@/app/data/page";
import { useOrders } from "@/hooks/useOrders";

export default function ReportsPage() {
  const { orders } = useOrders();

  const stats = useMemo(() => {
    return {
      delivered: orders.filter(o => o.status === "Delivered").length,
      processing: orders.filter(o => o.status === "Processing").length,
      pending: orders.filter(o => o.status === "Pending").length,
      total: orders.length
    };
  }, [orders]);

  const downloadReport = (report) => {
    const rows = [
      ["Report Name", report.name],
      ["Type", report.type],
      ["Generated", report.date],
      ["Status", report.status],
      ["Total Orders", String(stats.total)],
      ["Delivered Orders", String(stats.delivered)],
      ["Processing Orders", String(stats.processing)],
      ["Pending Orders", String(stats.pending)],
    ];

    const csv = rows
      .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${report.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="p-6">
        <h1 className="mb-4 text-2xl font-medium text-slate-900 dark:text-white">Reports & Analytics</h1>
        <section className="flex w-full flex-wrap gap-6">
          <div className="min-w-[240px] flex-1 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-colors dark:border-white/10 dark:bg-slate-900/80">
            <section className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-500/10">
                <FileText className="text-blue-600" size={24} />
              </div>
              <p className="font-light text-gray-500 dark:text-slate-400">Delivered</p>
            </section>
            <h3 className="mt-4 text-3xl font-medium text-slate-900 dark:text-white">{stats.delivered}</h3>
          </div>

          <div className="min-w-[240px] flex-1 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-colors dark:border-white/10 dark:bg-slate-900/80">
            <section className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 dark:bg-green-500/10">
                <TrendingUp className="text-green-600" size={24} />
              </div>
              <p className="font-light text-gray-500 dark:text-slate-400">Processing</p>
            </section>
            <h3 className="mt-4 text-3xl font-medium text-slate-900 dark:text-white">{stats.processing}</h3>
          </div>

          <div className="min-w-[240px] flex-1 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-colors dark:border-white/10 dark:bg-slate-900/80">
            <section className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-500/10">
                <FileText className="text-purple-600" size={24} />
              </div>
              <p className="font-light text-gray-500 dark:text-slate-400">Pending</p>
            </section>
            <h3 className="mt-4 text-3xl font-medium text-slate-900 dark:text-white">{stats.pending}</h3>
          </div>

          <div className="min-w-[240px] flex-1 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-colors dark:border-white/10 dark:bg-slate-900/80">
            <section className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-500/10">
                <Calendar className="text-orange-600" size={24} />
              </div>
              <p className="font-light text-gray-500 dark:text-slate-400">Total Orders</p>
            </section>
            <h3 className="mt-4 text-3xl font-medium text-slate-900 dark:text-white">{stats.total}</h3>
          </div>
        </section>
      </div>

      <section className="mx-8 mt-2 mb-12 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-colors dark:border-white/10 dark:bg-slate-900/80">
        <div className="border-b border-gray-50 p-6 dark:border-white/10">
          <h3 className="text-xl font-medium text-slate-900 dark:text-white">Available Reports</h3>
          <p className="mt-1 text-sm font-light text-gray-500 dark:text-slate-400">Download and view system-generated reports</p>
        </div>

        <div className="border-b border-gray-100 bg-gray-50 dark:border-white/10 dark:bg-white/5">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-4 px-6 py-4 text-xs font-medium uppercase text-gray-500 dark:text-slate-400">
            <p>Report Name</p>
            <p>Type</p>
            <p>Generated</p>
            <p>Size</p>
            <p className="text-center">Status</p>
            <p className="text-right">Actions</p>
          </div>
        </div>

        <div className="divide-y divide-gray-50 dark:divide-white/10">
          {reports.map((r) => (
            <div key={r.name} className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] items-center gap-4 px-6 py-5 transition-colors hover:bg-gray-50 dark:hover:bg-white/5">
              <div className="flex items-center gap-4 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 dark:bg-green-500/10">
                  <FileText className="text-green-600" size={18} />
                </div>
                <p className="truncate font-medium text-gray-900 dark:text-white">{r.name}</p>
              </div>
              <div><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 dark:bg-blue-500/10 dark:text-blue-300">{r.type}</span></div>
              <p className="whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">{r.date}</p>
              <p className="whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">{r.size}</p>
              <div className="text-center"><span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-500/10 dark:text-green-300">{r.status}</span></div>
              <div className="text-right">
                <button
                  onClick={() => downloadReport(r)}
                  className="rounded-lg bg-green-500 p-2 text-white shadow-sm transition-all hover:bg-green-600"
                >
                  <Download size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
