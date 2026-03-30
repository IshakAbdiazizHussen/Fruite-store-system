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
        <h1 className="text-2xl font-medium mb-4">Reports & Analytics</h1>
        <section className="flex flex-wrap gap-6 w-full">
          <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-100 flex-1 min-w-[240px]">
            <section className="flex items-start justify-between">
              <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FileText className="text-blue-600" size={24} />
              </div>
              <p className="font-light text-gray-500">Delivered</p>
            </section>
            <h3 className="text-3xl font-medium mt-4">{stats.delivered}</h3>
          </div>

          <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-100 flex-1 min-w-[240px]">
            <section className="flex items-start justify-between">
              <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="text-green-600" size={24} />
              </div>
              <p className="font-light text-gray-500">Processing</p>
            </section>
            <h3 className="text-3xl font-medium mt-4">{stats.processing}</h3>
          </div>

          <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-100 flex-1 min-w-[240px]">
            <section className="flex items-start justify-between">
              <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <FileText className="text-purple-600" size={24} />
              </div>
              <p className="font-light text-gray-500">Pending</p>
            </section>
            <h3 className="text-3xl font-medium mt-4">{stats.pending}</h3>
          </div>

          <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-100 flex-1 min-w-[240px]">
            <section className="flex items-start justify-between">
              <div className="h-12 w-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Calendar className="text-orange-600" size={24} />
              </div>
              <p className="font-light text-gray-500">Total Orders</p>
            </section>
            <h3 className="text-3xl font-medium mt-4">{stats.total}</h3>
          </div>
        </section>
      </div>

      <section className="mx-8 mt-2 mb-12 bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50">
          <h3 className="text-xl font-medium">Available Reports</h3>
          <p className="text-gray-500 text-sm font-light mt-1">Download and view system-generated reports</p>
        </div>

        <div className="bg-gray-50 border-b border-gray-100">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-4 px-6 py-4 text-xs uppercase font-medium text-gray-500">
            <p>Report Name</p>
            <p>Type</p>
            <p>Generated</p>
            <p>Size</p>
            <p className="text-center">Status</p>
            <p className="text-right">Actions</p>
          </div>
        </div>

        <div className="divide-y divide-gray-50">
          {reports.map((r) => (
            <div key={r.name} className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-4 items-center px-6 py-5 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4 min-w-0">
                <div className="h-10 w-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                  <FileText className="text-green-600" size={18} />
                </div>
                <p className="text-gray-900 font-medium truncate">{r.name}</p>
              </div>
              <div><span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-medium">{r.type}</span></div>
              <p className="text-gray-500 text-sm whitespace-nowrap">{r.date}</p>
              <p className="text-gray-500 text-sm whitespace-nowrap">{r.size}</p>
              <div className="text-center"><span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium">{r.status}</span></div>
              <div className="text-right">
                <button
                  onClick={() => downloadReport(r)}
                  className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition-all shadow-sm"
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
