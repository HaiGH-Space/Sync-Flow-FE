"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";

type DeleteConfirmModalProps = {
  isOpen: boolean;
  isLoading?: boolean;
  title: string;
  description?: string;
  onConfirm: () => void;
  onClose: (isOpen: boolean) => void;
};

export default function DeleteConfirmModal({
  isOpen,
  isLoading,
  title,
  description,
  onConfirm,
  onClose,
}: DeleteConfirmModalProps) {
  const t = useTranslations("common");
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="flex justify-end gap-x-2">
          <DialogClose asChild>
            <Button variant="outline">{t("actions.cancel")}</Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? t("status.deleting") : t("actions.confirm")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
