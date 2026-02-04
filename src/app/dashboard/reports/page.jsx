"use client";

import React from "react";
import { FileText, TrendingUp, Calendar, Download } from "lucide-react";
import {reports} from "@/app/data/page";


export default function ReportsPage() {
  return (
    <>
      <div className="p-6">
        <section className="flex flex-wrap gap-6 w-full">
          {/* CARD 1 */}
          <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100 flex-1 min-w-[260px]">
            <section className="flex items-start justify-between">
              <div>
                <FileText className="bg-blue-100 p-2 rounded-lg text-blue-600 h-12 w-11" size={33} />
              </div>
              <div>
                <p className="font-light text-gray-500">Delivered</p>
              </div>
            </section>

            <section className="p-2 text-3xl font-light">
              <p>4</p>
            </section>
          </div>

          {/* CARD 2 */}
          <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100 flex-1 min-w-[260px]">
            <section className="flex items-start justify-between">
              <div>
                <TrendingUp className="bg-green-100 p-2 rounded-lg text-green-600 h-12 w-11" size={33} />
              </div>
              <div>
                <p className="font-light text-gray-500">Processing</p>
              </div>
            </section>

            <section className="p-2 text-3xl font-light">
              <p>2</p>
            </section>
          </div>

          {/* CARD 3 */}
          <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100 flex-1 min-w-[260px]">
            <section className="flex items-start justify-between">
              <div>
                <FileText className="bg-purple-100 p-2 rounded-lg text-purple-600 h-12 w-11" size={33} />
              </div>
              <div>
                <p className="font-light text-gray-500">Pending</p>
              </div>
            </section>

            <section className="p-2 text-3xl font-light">
              <p>1</p>
            </section>
          </div>

          {/* CARD 4 */}
          <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100 flex-1 min-w-[260px]">
            <section className="flex items-start justify-between">
              <div>
                <Calendar className="bg-orange-100 p-2 rounded-lg text-orange-600 h-12 w-11" size={33} />
              </div>
              <div>
                <p className="font-light text-gray-500">Total Orders</p>
              </div>
            </section>

            <section className="p-2 text-3xl font-light">
              <p>8</p>
            </section>
          </div>
        </section>
      </div>

      {/* Table of Reports */}
      <section className="mx-8 mt-2 mb-2  bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* HEADER */}
        <div className="p-6">
          <h3 className="text-2xl font-light">Available Reports</h3>
          <p className="text-gray-500 font-light">Download and view generated reports</p>
        </div>

        {/* TABLE HEADER ROW */}
        <div className="bg-green-50 border-t border-gray-100">
          <div className="grid grid-cols-[minmax(320px,2fr)_120px_160px_90px_120px_160px] gap-x-6 px-6 py-4 text-sm uppercase text-gray-500">
            <p>Report Name</p>
            <p>Type</p>
            <p>Date Generated</p>
            <p>Size</p>
            <p>Status</p>
            <p>Actions</p>
          </div>
        </div>

        {/* ROWS */}
        <div className="divide-y">
          {reports.map((r) => (
            <div
              key={r.name}
              className="grid grid-cols-[minmax(320px,2fr)_120px_160px_90px_120px_160px] gap-x-6 items-center px-6 py-6 hover:bg-gray-50"
            >
              {/* REPORT NAME */}
              <div className="flex items-center gap-4 min-w-0">
                <div className="h-10 w-10 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                  <FileText className="text-green-600" size={18} />
                </div>
                <p className="text-gray-900 truncate">{r.name}</p>
              </div>

              {/* TYPE */}
              <div>
                <span className="inline-flex rounded-full bg-blue-100 text-blue-600 px-4 py-1 text-sm whitespace-nowrap">
                  {r.type}
                </span>
              </div>

              {/* DATE */}
              <p className="text-gray-700 whitespace-nowrap">{r.date}</p>

              {/* SIZE */}
              <p className="text-gray-700 whitespace-nowrap">{r.size}</p>

              {/* STATUS */}
              <div>
                <span className="inline-flex rounded-full bg-green-100 text-green-700 px-4 py-1 text-sm whitespace-nowrap">
                  {r.status}
                </span>
              </div>

              {/* ACTION */}
              <div>
                <button className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-2 rounded-xl hover:bg-green-600 transition-colors whitespace-nowrap">
                  <Download size={18} />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}