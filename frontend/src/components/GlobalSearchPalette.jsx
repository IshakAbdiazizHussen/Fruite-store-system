"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Command, CornerDownLeft, Search } from "lucide-react";

export default function GlobalSearchPalette({
  items,
  triggerMode = "input",
  triggerClassName = "",
  triggerPlaceholder = "Search menu...",
  hint = "Press / or Cmd/Ctrl K",
  keyboardShortcutsEnabled = true,
  slashShortcutEnabled = true,
  commandOnlyShortcut = false,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const inputRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return items;
    }

    return items.filter((item) => {
      const haystack = `${item.label} ${item.description} ${item.section}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [items, query]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setSelectedIndex(0);
  }, [isOpen, query]);

  useEffect(() => {
    if (!keyboardShortcutsEnabled) {
      return undefined;
    }

    const onGlobalShortcut = (event) => {
      if (shouldIgnoreShortcut(event.target)) {
        return;
      }

      const isSlashShortcut =
        slashShortcutEnabled &&
        event.key === "/" &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey;
      const isCommandPaletteShortcut = commandOnlyShortcut
        ? event.key.toLowerCase() === "k" && event.metaKey && !event.ctrlKey && !event.altKey
        : event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey);

      if (!isSlashShortcut && !isCommandPaletteShortcut) {
        if (isOpen && event.key === "Escape") {
          event.preventDefault();
          closePalette();
        }
        return;
      }

      event.preventDefault();
      openPalette();
    };

    window.addEventListener("keydown", onGlobalShortcut);
    return () => window.removeEventListener("keydown", onGlobalShortcut);
  }, [isOpen, keyboardShortcutsEnabled, slashShortcutEnabled, commandOnlyShortcut]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const focusTimer = window.setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 0);

    return () => window.clearTimeout(focusTimer);
  }, [isOpen]);

  function openPalette() {
    setIsOpen(true);
  }

  function closePalette() {
    setIsOpen(false);
    setQuery("");
    setSelectedIndex(0);
  }

  function openSelectedItem(index = selectedIndex) {
    const target = filteredItems[index];
    if (!target) {
      return;
    }

    router.push(target.href);
    closePalette();
  }

  function handleInputKeyDown(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      closePalette();
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelectedIndex((current) => Math.min(current + 1, filteredItems.length - 1));
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelectedIndex((current) => Math.max(current - 1, 0));
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      openSelectedItem();
    }
  }

  return (
    <>
      {triggerMode === "input" ? (
        <button
          type="button"
          onClick={openPalette}
          className={`flex w-full max-w-md items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-left dark:border-gray-700 dark:bg-gray-800 ${triggerClassName}`}
        >
          <Search className="shrink-0 text-gray-400 dark:text-gray-500" size={16} />
          <span className="flex-1 text-sm text-gray-400 dark:text-gray-500">{triggerPlaceholder}</span>
          {hint ? (
            <span className="hidden shrink-0 rounded-lg border border-gray-200 bg-white px-2 py-1 text-[11px] font-medium text-gray-400 dark:border-gray-700 dark:bg-slate-900 dark:text-slate-500 lg:inline-flex">
              {hint}
            </span>
          ) : null}
        </button>
      ) : (
        <button
          type="button"
          onClick={openPalette}
          className={`inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 ${triggerClassName}`}
        >
          <Search size={16} />
          <span>{triggerPlaceholder}</span>
          <span className="hidden rounded-lg border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] font-medium text-gray-400 dark:border-gray-700 dark:bg-slate-800 dark:text-slate-500 lg:inline-flex">
            Cmd/Ctrl K
          </span>
        </button>
      )}

      {isOpen ? (
        <div className="fixed inset-0 z-[100] flex items-start justify-center bg-slate-950/45 px-4 pt-20 backdrop-blur-sm" onClick={closePalette}>
          <div
            className="w-full max-w-2xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_28px_80px_rgba(15,23,42,0.18)] dark:border-white/10 dark:bg-slate-900 dark:shadow-[0_32px_100px_rgba(2,6,23,0.55)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="border-b border-slate-200 px-5 py-4 dark:border-white/10">
              <div className="flex items-center gap-3">
                <Search className="shrink-0 text-slate-400 dark:text-slate-500" size={18} />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={handleInputKeyDown}
                  placeholder="Search pages, reports, settings..."
                  className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
                />
                <button
                  type="button"
                  onClick={closePalette}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-500 dark:border-white/10 dark:bg-slate-800 dark:text-slate-400"
                >
                  Esc
                </button>
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-3">
              {filteredItems.length ? (
                <div className="space-y-1.5">
                  {filteredItems.map((item, index) => {
                    const isSelected = index === selectedIndex;
                    const isActive = pathname === item.href;

                    return (
                      <button
                        key={item.href}
                        type="button"
                        onClick={() => openSelectedItem(index)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition-colors ${
                          isSelected
                            ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                            : "bg-transparent text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold">{item.label}</span>
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] ${
                              isSelected
                                ? "bg-white/15 text-white dark:bg-slate-900/10 dark:text-slate-700"
                                : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                            }`}>
                              {item.section}
                            </span>
                            {isActive ? (
                              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                isSelected
                                  ? "bg-emerald-400/20 text-emerald-100 dark:bg-emerald-500/20 dark:text-emerald-700"
                                  : "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                              }`}>
                                Current
                              </span>
                            ) : null}
                          </div>
                          <p className={`mt-1 text-xs ${
                            isSelected ? "text-slate-200 dark:text-slate-600" : "text-slate-500 dark:text-slate-400"
                          }`}>
                            {item.description}
                          </p>
                        </div>
                        <CornerDownLeft className={`h-4 w-4 shrink-0 ${isSelected ? "text-slate-200 dark:text-slate-600" : "text-slate-300 dark:text-slate-600"}`} />
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-10 text-center dark:border-white/10">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">No results found</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Try another keyword or clear the search to see all menu items again.</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3 text-[11px] text-slate-500 dark:border-white/10 dark:text-slate-400">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 dark:border-white/10 dark:bg-slate-800">
                  <Command className="h-3 w-3" />
                  Cmd/Ctrl K
                </span>
                <span>Open search</span>
              </div>
              <div className="flex items-center gap-3">
                <span>↑↓ Navigate</span>
                <span>Enter Open</span>
                <span>Esc Close</span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function shouldIgnoreShortcut(target) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const tagName = target.tagName.toLowerCase();
  return (
    tagName === "input" ||
    tagName === "textarea" ||
    tagName === "select" ||
    target.isContentEditable ||
    target.closest("[contenteditable='true']") !== null ||
    target.closest("[role='textbox']") !== null
  );
}
