"use client";

import Image from "next/image";
import {
  ImageIcon,
  Mic,
  Paperclip,
  Send,
  Smile,
  Sticker,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { ActionIcon } from "./ActionIcon";
import { EmojiPicker } from "./EmojiPicker";
import { useTranslations } from "next-intl";
import { useComposer } from "./use-composer";

type ComposerProps = {
  onSendAction?: (value: string, file?: File | null) => void;
};

export function Composer({ onSendAction }: ComposerProps) {
  const t = useTranslations("dashboard");
  const {
    value,
    setValue,
    isEmojiOpen,
    setIsEmojiOpen,
    selectedImage,
    imagePreview,
    textareaRef,
    fileInputRef,
    handleSend,
    syncSelection,
    insertEmoji,
    handleFileChange,
    handleRemoveImage,
  } = useComposer({ onSendAction });

  return (
    <div className="border-t border-border/70 pt-3">
      <div className="flex flex-col gap-3 rounded-xl border border-border/70 bg-background/70 p-3 shadow-sm">
        {imagePreview && (
          <div className="relative self-start">
            <div className="relative size-24 overflow-hidden rounded-md border border-border">
              <Image
                src={imagePreview}
                alt={t("chatRightPanel.imagePreviewAlt")}
                fill
                unoptimized
                sizes="96px"
                className="object-cover"
              />
            </div>
            <button
              type="button"
              onClick={handleRemoveImage}
              aria-label={t("chatRightPanel.removeImageAriaLabel")}
              className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-destructive-foreground shadow-sm hover:bg-destructive/90 transition-colors"
            >
              <X className="size-3" />
            </button>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <ActionIcon label={t("chatRightPanel.attachFile")}>
            <Paperclip className="size-4" />
          </ActionIcon>
          <ActionIcon
            label={t("chatRightPanel.addImage")}
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageIcon className="size-4" />
          </ActionIcon>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            aria-label={t("chatRightPanel.attachImageAriaLabel")}
            className="hidden"
            onChange={handleFileChange}
          />

          <Popover open={isEmojiOpen} onOpenChange={setIsEmojiOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8"
                aria-label={t("chatRightPanel.insertEmojiAriaLabel")}
              >
                <Smile
                  className={`size-5 transition-colors ${
                    isEmojiOpen ? "text-primary" : "text-muted-foreground"
                  }`}
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              side="top"
              align="start"
              sideOffset={10}
              className="w-auto p-0 border-none shadow-2xl rounded-xl"
              onOpenAutoFocus={(e) => e.preventDefault()}
              onCloseAutoFocus={(e) => e.preventDefault()}
              onInteractOutside={(e) => {
                if (e.target === textareaRef.current) e.preventDefault();
              }}
              onFocusOutside={(e) => {
                if (e.target === textareaRef.current) e.preventDefault();
              }}
            >
              <EmojiPicker onSelectAction={insertEmoji} />
            </PopoverContent>
          </Popover>

          <ActionIcon label={t("chatRightPanel.sticker")}>
            <Sticker className="size-4" />
          </ActionIcon>
          <ActionIcon label={t("chatRightPanel.voice")}>
            <Mic className="size-4" />
          </ActionIcon>
        </div>

        <div className="flex items-end gap-2">
          <Textarea
            ref={textareaRef}
            rows={2}
            placeholder={t("chatRightPanel.messagePlaceholder")}
            className="min-h-11 flex-1 resize-none rounded-lg bg-background border-none focus-visible:ring-1 transition-all"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onSelect={syncSelection}
            onClick={syncSelection}
            onKeyUp={syncSelection}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button
            onClick={handleSend}
            disabled={!value.trim() && !selectedImage}
            size="sm"
            className="h-9 px-4 active:scale-95 transition-transform"
          >
            <Send className="size-4 mr-2" />
            {t("chatRightPanel.send")}
          </Button>
        </div>
      </div>
    </div>
  );
}
