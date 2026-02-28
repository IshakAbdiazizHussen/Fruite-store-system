"use client";

import { useState, useCallback, useEffect } from "react";
import { purchase as initialPurchases } from "@/app/data/page";
import { recordActivity } from "@/lib/activityLog";
import { readStorageJson } from "@/lib/safeStorage";

function normalizePurchaseIds(list) {
    const seen = new Set();
    let nextId = list.reduce((max, item) => {
        const match = String(item.purchaseId || "").match(/^PUR(\d+)$/);
        if (!match) return max;
        return Math.max(max, Number(match[1]));
    }, 0);

    return list.map((item) => {
        const existing = String(item.purchaseId || "");
        if (existing && !seen.has(existing)) {
            seen.add(existing);
            return item;
        }

        nextId += 1;
        const generated = `PUR${String(nextId).padStart(3, "0")}`;
        seen.add(generated);
        return { ...item, purchaseId: generated };
    });
}

export function usePurchases() {
    const [purchases, setPurchases] = useState(initialPurchases);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const parsed = readStorageJson("fruit_store_purchases", null);
        if (Array.isArray(parsed)) {
            setPurchases(normalizePurchaseIds(parsed));
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) localStorage.setItem("fruit_store_purchases", JSON.stringify(purchases));
    }, [purchases, isLoaded]);

    const addPurchase = useCallback((newPurchase) => {
        setPurchases((prev) => {
            const maxId = prev.reduce((max, item) => {
                const match = String(item.purchaseId || "").match(/^PUR(\d+)$/);
                if (!match) return max;
                return Math.max(max, Number(match[1]));
            }, 0);

            const createdId = `PUR${String(maxId + 1).padStart(3, "0")}`;
            return [{ ...newPurchase, purchaseId: createdId }, ...prev];
        });

        recordActivity({
            type: "create",
            title: "Purchase added",
            description: `New purchase was created for ${newPurchase.supplier}.`,
        });
    }, []);

    const updatePurchaseStatus = useCallback((purchaseId, status) => {
        setPurchases((prev) =>
            prev.map((p) => (p.purchaseId === purchaseId ? { ...p, status } : p))
        );
        recordActivity({
            type: "update",
            title: "Purchase status updated",
            description: `${purchaseId} changed to ${status}.`,
        });
    }, []);

    const updatePurchase = useCallback((updatedPurchase) => {
        setPurchases((prev) =>
            prev.map((p) => (p.purchaseId === updatedPurchase.purchaseId ? updatedPurchase : p))
        );
        recordActivity({
            type: "update",
            title: "Purchase updated",
            description: `${updatedPurchase.purchaseId} was edited.`,
        });
    }, []);

    return { purchases, addPurchase, updatePurchaseStatus, updatePurchase };
}
