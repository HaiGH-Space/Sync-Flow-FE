"use client";

import { AvatarWithBadge } from "@/components/shared/AvatarWithBadge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProfile } from "@/hooks/use-profile";
import { useUpdateMyAvatar } from "@/hooks/mutations/user";
import { useRouter } from "@/i18n/navigation";
import { ApiRequestError } from "@/lib/api/api";
import { uploadService } from "@/lib/api/upload";
import { useUserStore } from "@/lib/store/use-user-profile";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut, PencilLine } from "lucide-react";
import type { ChangeEvent } from "react";
import { useRef } from "react";
import { toast } from "sonner";

export function NavigationSidebarFooter() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const queryClient = useQueryClient();
  const { replace } = useRouter();
  const { data: userProfile } = useProfile();
  const updateAvatarMutation = useUpdateMyAvatar();
  const logout = useUserStore((state) => state.logout);

  const src = userProfile?.image ?? "";
  const alt = userProfile?.name ? `${userProfile.name} avatar` : "user avatar";
  const avtFallback = (userProfile?.name ?? "U").charAt(0).toUpperCase();

  const onPickAvatar = () => {
    if (updateAvatarMutation.isPending) return;
    fileInputRef.current?.click();
  };

  const onLogout = async () => {
    await logout();
    queryClient.clear();
    replace("/auth");
  };

  const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const toastId = "update-avatar";
    toast.loading("Updating avatar...", { id: toastId });

    try {
      await updateAvatarMutation.mutateAsync({ file, filename: file.name });
      toast.success("Avatar updated", { id: toastId });
    } catch {
      try {
        const uploadRes = await uploadService.uploadFile({
          file,
          filename: file.name,
          folder: "avatars",
        });
        await updateAvatarMutation.mutateAsync({ image: uploadRes.data.url });
        toast.success("Avatar updated", { id: toastId });
      } catch (fallbackErr) {
        const message =
          fallbackErr instanceof ApiRequestError
            ? fallbackErr.message
            : fallbackErr instanceof Error
              ? fallbackErr.message
              : "Update avatar failed";
        toast.error(message, { id: toastId });
      }
    }
  };

  return (
    <div className="p-4 border-t border-border">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        aria-label="Upload avatar image"
        className="hidden"
        onChange={onFileChange}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
            aria-label="Open profile menu"
          >
            <AvatarWithBadge
              alt={alt}
              src={src}
              avtFallback={avtFallback}
              status="online"
            />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" sideOffset={12}>
          <DropdownMenuLabel className="max-w-56 truncate">
            {userProfile?.name ?? "Your account"}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={onPickAvatar}
            disabled={updateAvatarMutation.isPending}
          >
            <PencilLine />
            Change avatar
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onSelect={onLogout}>
            <LogOut />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
