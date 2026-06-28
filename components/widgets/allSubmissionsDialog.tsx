"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Time } from "@/lib/types";

type Row = { id: number; date: string; time: Time; note: string };
type Cursor = { entryDate: string; id: number } | null;

const formatDate = (value: string) => {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString();
};

export default function AllSubmissionsDialog() {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const [cursor, setCursor] = useState<Cursor>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const initialLoaded = useRef(false);

  const loadNext = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    try {
      const qs = new URLSearchParams({ limit: "25" });
      if (cursor) {
        qs.set("cursorDate", cursor.entryDate);
        qs.set("cursorId", String(cursor.id));
      }
      const res = await fetch("/api/time-entries?" + qs.toString(), { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load submissions");
      const data = (await res.json()) as { items: Row[]; nextCursor: Cursor };
      setRows((prev) => [...prev, ...data.items]);
      setCursor(data.nextCursor);
      setHasMore(Boolean(data.nextCursor));
    } finally {
      setIsLoading(false);
    }
  }, [cursor, hasMore, isLoading]);

  useEffect(() => {
    if (!open || initialLoaded.current) return;
    initialLoaded.current = true;
    void loadNext();
  }, [open, loadNext]);

  useEffect(() => {
    if (!open || !hasMore || isLoading) return;
    const node = sentinelRef.current;
    if (!node) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) void loadNext();
      },
      { rootMargin: "240px" }
    );

    io.observe(node);
    return () => io.disconnect();
  }, [open, hasMore, isLoading, loadNext]);

  const empty = useMemo(() => rows.length === 0 && !isLoading, [rows.length, isLoading]);

  return (
    <>
      <Button type="button" variant="outline" className="mt-4 w-full" onClick={() => setOpen(true)}>
        View All Submissions
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton
          className="h-screen w-screen max-w-none translate-x-[-50%] translate-y-[-50%] rounded-none p-4 sm:p-6"
        >
          <DialogHeader>
            <DialogTitle>All Submissions</DialogTitle>
          </DialogHeader>

          <div className="h-[calc(100vh-8rem)] overflow-auto">
            <table className="min-w-full border-separate border-spacing-0 text-left text-md">
              <thead className="sticky top-0 bg-background">
                <tr className="text-sm uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  <th className="border-b border-zinc-200 px-3 py-2 dark:border-zinc-800">Date</th>
                  <th className="border-b border-zinc-200 px-3 py-2 dark:border-zinc-800">Time Submitted</th>
                  <th className="border-b border-zinc-200 px-3 py-2 dark:border-zinc-800">Note</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((s) => (
                  <tr key={s.id}>
                    <td className="border-b border-zinc-100 px-3 py-2 text-zinc-700 dark:border-zinc-800 dark:text-zinc-200">
                      {formatDate(s.date)}
                    </td>
                    <td className="border-b border-zinc-100 px-3 py-2 text-zinc-700 dark:border-zinc-800 dark:text-zinc-200">
                      {s.time.hours}hr {s.time.minutes}min
                    </td>
                    <td className="max-w-75 border-b border-zinc-100 px-3 py-2 text-zinc-700 dark:border-zinc-800 dark:text-zinc-200">
                      {s.note}
                    </td>
                  </tr>
                ))}

                {isLoading && (
                  <tr>
                    <td colSpan={3} className="px-3 py-5 text-center text-zinc-500 dark:text-zinc-400">
                      Loading...
                    </td>
                  </tr>
                )}

                {empty && (
                  <tr>
                    <td colSpan={3} className="px-3 py-5 text-center text-zinc-500 dark:text-zinc-400">
                      No submissions yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div ref={sentinelRef} className="h-2" />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}