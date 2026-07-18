"use client";

import {
  useEffect,
  useRef,
  useState,
  useDeferredValue,
} from "react";
import { Search } from "lucide-react";
import emojiLibData from "emojilib";

import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

type EmojiPickerProps = {
  onSelectAction: (emoji: string) => void;
};

const ALL_EMOJIS = Object.entries(emojiLibData);

const INITIAL_EMOJI_BATCH = 40;
const EMOJI_BATCH_SIZE = 40;

const EmojiButton = ({ emoji, onClick }: { emoji: string; onClick: (e: string) => void }) => (
  <button
    type="button"
    onPointerDown={(e) => e.preventDefault()}
    onClick={() => onClick(emoji)}
    className="flex items-center justify-center size-11 text-2xl hover:bg-accent rounded-xl transition-all active:scale-75 hover:scale-110 will-change-transform"
  >
    {emoji}
  </button>
);
EmojiButton.displayName = "EmojiButton";

export const EmojiPicker = ({ onSelectAction }: EmojiPickerProps) => {
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);

  const [visibleCount, setVisibleCount] = useState(INITIAL_EMOJI_BATCH);
  const scrollViewportRef = useRef<HTMLDivElement | null>(null);
  const loadMoreSentinelRef = useRef<HTMLDivElement | null>(null);

  const query = deferredSearch.toLowerCase();
  const filteredEmojis = !query
    ? ALL_EMOJIS
    : ALL_EMOJIS.filter(([, keywords]) => keywords.some((k) => k.includes(query)));

  const visibleEmojis = filteredEmojis.slice(0, visibleCount);

  useEffect(() => {
    const sentinel = loadMoreSentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((current) =>
            Math.min(current + EMOJI_BATCH_SIZE, filteredEmojis.length),
          );
        }
      },
      {
        root: scrollViewportRef.current,
        rootMargin: "250px",
        threshold: 0,
      },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [filteredEmojis.length]);

  return (
    <div className="flex flex-col h-105 w-full sm:w-87.5 bg-popover text-popover-foreground rounded-xl border shadow-2xl overflow-hidden">
      <div className="p-4 border-b border-border/50 bg-popover/95 backdrop-blur">
        <div className="relative">
          <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
          <Input
            placeholder="Tìm emoji..."
            className="pl-9 h-10 bg-muted/50 border-none focus-visible:ring-1 rounded-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full" viewportRef={scrollViewportRef}>
          <div className="p-4">
            <div className="grid grid-cols-6 gap-2 content-start">
              {visibleEmojis.map(([emoji]) => (
                <EmojiButton
                  key={emoji}
                  emoji={emoji}
                  onClick={onSelectAction}
                />
              ))}
            </div>

            {visibleCount < filteredEmojis.length && (
              <div
                ref={loadMoreSentinelRef}
                className="h-10 w-full flex items-center justify-center"
                aria-hidden="true"
              >
                <div className="size-1 bg-muted-foreground/20 rounded-full animate-pulse" />
              </div>
            )}

            {filteredEmojis.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Search className="size-8 mb-2 opacity-20" />
                <p className="text-xs">Không tìm thấy emoji</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      <div className="py-2 border-t border-border/40 bg-muted/5 text-[9px] text-center text-muted-foreground/50 uppercase tracking-widest font-bold">
        {filteredEmojis.length} Emojis Found
      </div>
    </div>
  );
};
EmojiPicker.displayName = "EmojiPicker";
