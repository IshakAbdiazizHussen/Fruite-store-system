"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { useFrontendContent } from "@/hooks/useFrontendContent";

function TextInput({ value, onChange, className = "" }) {
  return (
    <input
      className={`rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-400 dark:border-white/10 dark:bg-slate-950 dark:text-white ${className}`}
      value={value}
      onChange={onChange}
    />
  );
}

function Textarea({ value, onChange, className = "" }) {
  return (
    <textarea
      className={`min-h-24 rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-400 dark:border-white/10 dark:bg-slate-950 dark:text-white ${className}`}
      value={value}
      onChange={onChange}
    />
  );
}

export default function AdminSettingsPage() {
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
    setStatus("Backend settings saved.");
  }

  return (
    <div className="space-y-6 p-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-600 dark:text-emerald-300">Settings Control</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">Edit backend-managed text</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Change branding and login text from the backend without showing the customer-facing screens here.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900/80">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Branding</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <TextInput value={form.branding?.appName || ""} onChange={(e) => updateSection("branding", "appName", e.target.value)} />
            <TextInput value={form.branding?.sidebarTitle || ""} onChange={(e) => updateSection("branding", "sidebarTitle", e.target.value)} />
            <TextInput value={form.branding?.sidebarSubtitle || ""} onChange={(e) => updateSection("branding", "sidebarSubtitle", e.target.value)} />
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900/80">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Login Text</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <TextInput value={form.login?.eyebrow || ""} onChange={(e) => updateSection("login", "eyebrow", e.target.value)} />
            <TextInput value={form.login?.title || ""} onChange={(e) => updateSection("login", "title", e.target.value)} />
            <Textarea className="md:col-span-2" value={form.login?.subtitle || ""} onChange={(e) => updateSection("login", "subtitle", e.target.value)} />
            <Textarea value={form.login?.heroTitle || ""} onChange={(e) => updateSection("login", "heroTitle", e.target.value)} />
            <Textarea value={form.login?.heroDescription || ""} onChange={(e) => updateSection("login", "heroDescription", e.target.value)} />
          </div>
        </section>

        <button type="submit" className="inline-flex items-center gap-2 rounded-2xl bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700">
          <Save className="h-4 w-4" />
          Save Settings
        </button>
        {status ? <p className="text-sm text-emerald-600 dark:text-emerald-300">{status}</p> : null}
      </form>
    </div>
  );
}
