import { useRef, useState, useEffect } from "react";

type UseComposerProps = {
  onSendAction?: (value: string, file?: File | null) => void;
};

export function useComposer({ onSendAction }: UseComposerProps) {
  const [value, setValue] = useState("");
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const selectionRef = useRef({ start: 0, end: 0 });
  const keepEmojiPickerOpenRef = useRef(false);

  // Revoke object URL to prevent memory leaks when image changes or unmounts
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed && !selectedImage) return;
    onSendAction?.(trimmed, selectedImage);
    setValue("");
    setSelectedImage(null);
    setImagePreview(null);
    selectionRef.current = { start: 0, end: 0 };
  };

  const syncSelection = () => {
    if (textareaRef.current) {
      selectionRef.current = {
        start: textareaRef.current.selectionStart,
        end: textareaRef.current.selectionEnd,
      };
    }
  };

  const insertEmoji = (emoji: string) => {
    keepEmojiPickerOpenRef.current = true;
    const { start, end } = selectionRef.current;

    setValue((prev) => {
      return prev.substring(0, start) + emoji + prev.substring(end);
    });

    const nextCursor = start + emoji.length;
    selectionRef.current = { start: nextCursor, end: nextCursor };

    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(nextCursor, nextCursor);
      }
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      e.target.value = "";
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
  };

  return {
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
  };
}
