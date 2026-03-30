"use client";

import { useEffect, useState } from "react";
import { MonitorSmartphone, Save } from "lucide-react";
import { useFrontendContent } from "@/hooks/useFrontendContent";

export default function FrontendContentPage() {
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

  function updateAction(index, key, value) {
    setForm((prev) => ({
      ...prev,
      dashboard: {
        ...prev.dashboard,
        actions: prev.dashboard.actions.map((action, actionIndex) =>
          actionIndex === index ? { ...action, [key]: value } : action
        ),
      },
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("");
    await updateContent(form);
    setStatus("Frontend content updated successfully.");
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Frontend CMS</h1>
          <p className="mt-2 text-sm text-gray-500">
            Control the public-facing labels and dashboard copy from the backend.
          </p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
          <MonitorSmartphone className="h-6 w-6 text-green-600" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Branding</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-gray-700">App Name</span>
              <input
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none"
                value={form.branding?.appName || ""}
                onChange={(event) => updateSection("branding", "appName", event.target.value)}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-gray-700">Sidebar Title</span>
              <input
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none"
                value={form.branding?.sidebarTitle || ""}
                onChange={(event) => updateSection("branding", "sidebarTitle", event.target.value)}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-gray-700">Sidebar Subtitle</span>
              <input
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none"
                value={form.branding?.sidebarSubtitle || ""}
                onChange={(event) => updateSection("branding", "sidebarSubtitle", event.target.value)}
              />
            </label>
          </div>
        </section>

        <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Login Page</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-gray-700">Eyebrow</span>
              <input
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none"
                value={form.login?.eyebrow || ""}
                onChange={(event) => updateSection("login", "eyebrow", event.target.value)}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-gray-700">Title</span>
              <input
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none"
                value={form.login?.title || ""}
                onChange={(event) => updateSection("login", "title", event.target.value)}
              />
            </label>
            <label className="block md:col-span-2">
              <span className="mb-1.5 block text-sm font-medium text-gray-700">Subtitle</span>
              <textarea
                className="min-h-24 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none"
                value={form.login?.subtitle || ""}
                onChange={(event) => updateSection("login", "subtitle", event.target.value)}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-gray-700">Hero Title</span>
              <textarea
                className="min-h-28 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none"
                value={form.login?.heroTitle || ""}
                onChange={(event) => updateSection("login", "heroTitle", event.target.value)}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-gray-700">Hero Description</span>
              <textarea
                className="min-h-28 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none"
                value={form.login?.heroDescription || ""}
                onChange={(event) => updateSection("login", "heroDescription", event.target.value)}
              />
            </label>
          </div>
        </section>

        <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Dashboard Copy</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-gray-700">Dashboard Title</span>
              <input
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none"
                value={form.dashboard?.title || ""}
                onChange={(event) => updateSection("dashboard", "title", event.target.value)}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-gray-700">Dashboard Subtitle</span>
              <input
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none"
                value={form.dashboard?.subtitle || ""}
                onChange={(event) => updateSection("dashboard", "subtitle", event.target.value)}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-gray-700">Quick Actions Title</span>
              <input
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none"
                value={form.dashboard?.quickActionsTitle || ""}
                onChange={(event) => updateSection("dashboard", "quickActionsTitle", event.target.value)}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-gray-700">Quick Actions Subtitle</span>
              <input
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none"
                value={form.dashboard?.quickActionsSubtitle || ""}
                onChange={(event) => updateSection("dashboard", "quickActionsSubtitle", event.target.value)}
              />
            </label>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {(form.dashboard?.actions || []).map((action, index) => (
              <div key={`${action.href}-${index}`} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <p className="mb-3 text-sm font-semibold text-gray-900">Action {index + 1}</p>
                <label className="mb-3 block">
                  <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500">Label</span>
                  <input
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 outline-none"
                    value={action.label}
                    onChange={(event) => updateAction(index, "label", event.target.value)}
                  />
                </label>
                <label className="mb-3 block">
                  <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500">Link</span>
                  <input
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 outline-none"
                    value={action.href}
                    onChange={(event) => updateAction(index, "href", event.target.value)}
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500">Tone</span>
                  <select
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 outline-none"
                    value={action.tone}
                    onChange={(event) => updateAction(index, "tone", event.target.value)}
                  >
                    <option value="neutral">Neutral</option>
                    <option value="success">Success</option>
                    <option value="info">Info</option>
                  </select>
                </label>
              </div>
            ))}
          </div>
        </section>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-2xl bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700"
          >
            <Save className="h-4 w-4" />
            Save Frontend Content
          </button>
          {status ? <p className="text-sm text-green-600">{status}</p> : null}
        </div>
      </form>
    </div>
  );
}
