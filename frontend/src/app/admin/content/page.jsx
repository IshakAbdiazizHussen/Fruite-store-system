"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { useFrontendContent } from "@/hooks/useFrontendContent";

export default function AdminContentPage() {
  const { content, updateContent } = useFrontendContent({ authenticated: true });
  const [form, setForm] = useState(content);
  const [status, setStatus] = useState("");

  useEffect(() => {
    setForm(content);
  }, [content]);

  function updateSection(section, key, value) {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("");
    await updateContent(form);
    setStatus("Frontend information saved.");
  }

  return (
    <div className="space-y-6 p-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-600">Admin Content</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">Frontend information control</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Branding</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <input className="rounded-2xl border border-slate-200 px-4 py-3 outline-none" value={form.branding?.appName || ""} onChange={(e) => updateSection("branding", "appName", e.target.value)} />
            <input className="rounded-2xl border border-slate-200 px-4 py-3 outline-none" value={form.branding?.sidebarTitle || ""} onChange={(e) => updateSection("branding", "sidebarTitle", e.target.value)} />
            <input className="rounded-2xl border border-slate-200 px-4 py-3 outline-none" value={form.branding?.sidebarSubtitle || ""} onChange={(e) => updateSection("branding", "sidebarSubtitle", e.target.value)} />
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Login</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <input className="rounded-2xl border border-slate-200 px-4 py-3 outline-none" value={form.login?.eyebrow || ""} onChange={(e) => updateSection("login", "eyebrow", e.target.value)} />
            <input className="rounded-2xl border border-slate-200 px-4 py-3 outline-none" value={form.login?.title || ""} onChange={(e) => updateSection("login", "title", e.target.value)} />
            <textarea className="min-h-24 rounded-2xl border border-slate-200 px-4 py-3 outline-none md:col-span-2" value={form.login?.subtitle || ""} onChange={(e) => updateSection("login", "subtitle", e.target.value)} />
            <textarea className="min-h-28 rounded-2xl border border-slate-200 px-4 py-3 outline-none" value={form.login?.heroTitle || ""} onChange={(e) => updateSection("login", "heroTitle", e.target.value)} />
            <textarea className="min-h-28 rounded-2xl border border-slate-200 px-4 py-3 outline-none" value={form.login?.heroDescription || ""} onChange={(e) => updateSection("login", "heroDescription", e.target.value)} />
          </div>
        </section>

        <button type="submit" className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700">
          <Save className="h-4 w-4" />
          Save Information
        </button>
        {status ? <p className="text-sm text-emerald-600">{status}</p> : null}
      </form>
    </div>
  );
}
