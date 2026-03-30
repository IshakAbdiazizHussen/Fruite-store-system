"use client";

const QUEUE_KEY = "fruit_store_email_queue";

export function getEmailQueue() {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem(QUEUE_KEY);
    if (!saved) return [];
    try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export function queueEmailNotification(entry) {
    if (typeof window === "undefined") return;
    const queue = getEmailQueue();
    const next = [
        {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            title: entry.title || "Update",
            description: entry.description || "",
            at: new Date().toISOString(),
        },
        ...queue,
    ].slice(0, 40);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("fruit-store-email-queue-updated"));
}

export function clearEmailQueue() {
    if (typeof window === "undefined") return;
    localStorage.setItem(QUEUE_KEY, JSON.stringify([]));
    window.dispatchEvent(new Event("fruit-store-email-queue-updated"));
}

export function openEmailDraft(to, subject = "Fruit Store Notifications") {
    if (typeof window === "undefined") return;
    const queue = getEmailQueue();
    const lines = queue.length
        ? queue.map((q, i) => `${i + 1}. ${q.title} - ${q.description} (${new Date(q.at).toLocaleString()})`)
        : ["No new queued notifications."];
    const body = `Hello,\n\nHere are your latest Fruit Store notifications:\n\n${lines.join("\n")}\n\nGenerated: ${new Date().toLocaleString()}`;
    const href = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
}
