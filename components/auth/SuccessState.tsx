"use client";
import { useRouter } from "@/i18n/navigation";
import { AvatarWithBadge } from "@/components/shared/AvatarWithBadge";
import { ApiRequestError } from "@/lib/api/api";
import { uploadService } from "@/lib/api/upload";
import { useMarkWelcomeSeen, useUpdateMyAvatar } from "@/hooks/mutations/user";
import { useProfile } from "@/hooks/use-profile";
import { useUserStore } from "@/lib/store/use-user-profile";
import { Camera, Check, Loader2 } from "lucide-react";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { useSearchParams } from "next/navigation";
import type { ChangeEvent } from "react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

interface SuccessStateProps {
  isLogin: boolean;
  userName?: string;
}

const SuccessState = ({ isLogin, userName }: SuccessStateProps) => {
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const { get } = searchParams;
  const redirectTo = get("redirectTo") || "/dashboard";
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { data: profile } = useProfile();
  const markWelcomeSeenMutation = useMarkWelcomeSeen();
  const updateAvatarMutation = useUpdateMyAvatar();
  const { userProfile } = useUserStore();

  const displayProfile = profile ?? userProfile;
  const displayName = displayProfile?.name ?? userName ?? "User";
  const avatarSrc = displayProfile?.image ?? "";
  const avatarFallback = displayName.charAt(0).toUpperCase();
  const shouldShowAvatarPrompt =
    isLogin && displayProfile?.hasSeenWelcome === false;
  const shouldAutoRedirect = isLogin && displayProfile?.hasSeenWelcome === true;

  useEffect(() => {
    if (!shouldAutoRedirect) {
      return;
    }

    const timer = window.setTimeout(() => {
      push(redirectTo);
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [redirectTo, push, shouldAutoRedirect]);

  const markWelcomeSeen = async () => {
    if (
      displayProfile?.hasSeenWelcome !== false ||
      markWelcomeSeenMutation.isPending
    ) {
      return;
    }

    await markWelcomeSeenMutation.mutateAsync();
  };

  const onPickAvatar = () => {
    if (updateAvatarMutation.isPending) return;
    fileInputRef.current?.click();
  };

  const onFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const toastId = "welcome-update-avatar";
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

  const completeWelcome = async () => {
    if (displayProfile?.hasSeenWelcome === false) {
      try {
        await markWelcomeSeen();
      } catch (error) {
        const message =
          error instanceof ApiRequestError
            ? error.message
            : error instanceof Error
              ? error.message
              : "Failed to save welcome state";
        toast.error(message);
      }
    }

    push(redirectTo);
  };

  const onContinue = () => {
    void completeWelcome();
  };

  const onSkipAvatar = () => {
    void completeWelcome();
  };

  if (!isLogin) {
    return (
      <LazyMotion features={domAnimation}>
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col py-8 items-center justify-center text-center"
        >
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="relative w-20 h-20 mb-6"
          >
            <m.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1.2 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
                delay: 0.1,
              }}
              className="flex justify-center items-center absolute inset-0 rounded-full bg-primary"
            >
              <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 20,
                  delay: 0.2,
                }}
              >
                <Check
                  className="w-10 h-10 text-primary-foreground"
                  strokeWidth={3}
                />
              </m.div>
            </m.div>
          </m.div>
          <m.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-semibold"
          >
            Account Created Successfully!
          </m.h2>
          <m.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-2 text-sm text-muted-foreground"
          >
            Redirecting you to your login in 3 seconds…
          </m.p>
        </m.div>
      </LazyMotion>
    );
  }

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col gap-6 py-2 text-center"
      >
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="mx-auto relative w-20 h-20 mb-2"
        >
          <m.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1.2 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: 0.1,
            }}
            className="flex justify-center items-center absolute inset-0 rounded-full bg-primary"
          >
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 20,
                delay: 0.2,
              }}
            >
              <Check
                className="w-10 h-10 text-primary-foreground"
                strokeWidth={3}
              />
            </m.div>
          </m.div>
        </m.div>

        <m.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="text-2xl font-semibold"
        >
          Welcome back, {displayName}!
        </m.h2>

        {shouldShowAvatarPrompt ? (
          <>
            <m.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="rounded-2xl border border-border bg-background/70 p-4 shadow-sm"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onFileChange}
              />
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4 text-left">
                  <button
                    type="button"
                    onClick={onPickAvatar}
                    disabled={updateAvatarMutation.isPending}
                    className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
                    aria-label="Update avatar"
                  >
                    <AvatarWithBadge
                      alt={`${displayName} avatar`}
                      src={avatarSrc}
                      avtFallback={avatarFallback}
                      status="online"
                    />
                  </button>
                  <div>
                    <p className="font-medium">Avatar</p>
                    <p className="text-sm text-muted-foreground">
                      Tap the avatar to upload a new photo.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onPickAvatar}
                  disabled={updateAvatarMutation.isPending}
                  className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {updateAvatarMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Camera className="h-4 w-4" />
                  )}
                  Change avatar
                </button>
              </div>
            </m.div>

            <m.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="flex flex-col gap-3 sm:flex-row sm:justify-center"
            >
              <button
                type="button"
                onClick={onContinue}
                disabled={markWelcomeSeenMutation.isPending}
                className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Continue to dashboard
              </button>
              <button
                type="button"
                onClick={onSkipAvatar}
                disabled={markWelcomeSeenMutation.isPending}
                className="inline-flex items-center justify-center rounded-md border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
              >
                Skip avatar for now
              </button>
            </m.div>
          </>
        ) : (
          <m.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="flex flex-col gap-3 text-center"
          >
            <p className="text-sm text-muted-foreground">
              You have already completed the welcome step. Redirecting you to
              the dashboard in 3 seconds…
            </p>
          </m.div>
        )}
      </m.div>
    </LazyMotion>
  );
};

export default SuccessState;
