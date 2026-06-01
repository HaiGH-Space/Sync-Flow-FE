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
import type { ChangeEvent } from "react";
import { useRef } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface SuccessStateProps {
  isLogin: boolean;
  userName?: string;
  redirectTo: string;
}

type SuccessStateDerived = {
  displayName: string;
  avatarSrc: string;
  avatarFallback: string;
  shouldShowAvatarPrompt: boolean;
};

type SuccessAvatarPromptProps = {
  displayName: string;
  avatarSrc: string;
  avatarFallback: string;
  isUpdatingAvatar: boolean;
  isCompleting: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onPickAvatar: () => void;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onContinue: () => void;
  onSkipAvatar: () => void;
};

function SuccessAvatarPrompt({
  displayName,
  avatarSrc,
  avatarFallback,
  isUpdatingAvatar,
  isCompleting,
  fileInputRef,
  onPickAvatar,
  onFileChange,
  onContinue,
  onSkipAvatar,
}: SuccessAvatarPromptProps) {
  return (
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
          aria-label="Upload avatar image"
          className="hidden"
          onChange={onFileChange}
        />
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4 text-left">
            <button
              type="button"
              onClick={onPickAvatar}
              disabled={isUpdatingAvatar}
              className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
              aria-label={tAuth("success.avatar.update_aria")}
            >
              <AvatarWithBadge
                alt={tAuth("success.avatar.alt", { name: displayName })}
                src={avatarSrc}
                avtFallback={avatarFallback}
                status="online"
              />
            </button>
            <div>
              <p className="font-medium">{tAuth("success.avatar.label")}</p>
              <p className="text-sm text-muted-foreground">
                {tAuth("success.avatar.support")}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onPickAvatar}
            disabled={isUpdatingAvatar}
            className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isUpdatingAvatar ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Camera className="size-4" />
            )}
            {tAuth("success.avatar.change")}
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
          disabled={isCompleting}
          className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {tAuth("success.avatar.continue")}
        </button>
        <button
          type="button"
          onClick={onSkipAvatar}
          disabled={isCompleting}
          className="inline-flex items-center justify-center rounded-md border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
        >
          {tAuth("success.avatar.skip")}
        </button>
      </m.div>
    </>
  );
}

type SuccessRedirectNoticeProps = {
  text: string;
};

function SuccessRedirectNotice({ text }: SuccessRedirectNoticeProps) {
  return (
    <m.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45 }}
      className="flex flex-col gap-3 text-center"
    >
      <p className="text-sm text-muted-foreground">{text}</p>
    </m.div>
  );
}

type SuccessCheckHeroProps = {
  title: string;
  subtitle: string;
  wrapperClassName: string;
};

function SuccessCheckHero({
  title,
  subtitle,
  wrapperClassName,
}: SuccessCheckHeroProps) {
  return (
    <LazyMotion features={domAnimation}>
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={wrapperClassName}
      >
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="mx-auto relative size-20 mb-2"
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
                className="size-10 text-primary-foreground"
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
          {title}
        </m.h2>

        <m.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-2 text-sm text-muted-foreground"
        >
          {subtitle}
        </m.p>
      </m.div>
    </LazyMotion>
  );
}

const SuccessState = ({ isLogin, userName, redirectTo }: SuccessStateProps) => {
  const { push } = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const tAuth = useTranslations("auth");
  const { data: profile } = useProfile();
  const markWelcomeSeenMutation = useMarkWelcomeSeen();
  const updateAvatarMutation = useUpdateMyAvatar();
  const { userProfile } = useUserStore();

  const displayProfile = profile ?? userProfile;

  const derived: SuccessStateDerived = {
    displayName: displayProfile?.name ?? userName ?? "User",
    avatarSrc: displayProfile?.image ?? "",
    avatarFallback: (displayProfile?.name ?? userName ?? "User")
      .charAt(0)
      .toUpperCase(),
    shouldShowAvatarPrompt: isLogin && displayProfile?.hasSeenWelcome === false,
  };

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
    toast.loading(tAuth("success.avatar.uploading"), { id: toastId });

    try {
      await updateAvatarMutation.mutateAsync({ file, filename: file.name });
      toast.success(tAuth("success.avatar.updated"), { id: toastId });
    } catch {
      try {
        const uploadRes = await uploadService.uploadFile({
          file,
          filename: file.name,
          folder: "avatars",
        });

        await updateAvatarMutation.mutateAsync({ image: uploadRes.data.url });
        toast.success(tAuth("success.avatar.updated"), { id: toastId });
      } catch (fallbackErr) {
        const message =
          fallbackErr instanceof ApiRequestError
            ? fallbackErr.message
            : fallbackErr instanceof Error
              ? fallbackErr.message
              : tAuth("success.avatar.update_failed");
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
              : tAuth("success.welcome_saved_error");
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
      <SuccessCheckHero
        wrapperClassName="flex flex-col py-8 items-center justify-center text-center"
        title={tAuth("success.created_title")}
        subtitle={tAuth("success.created_subtitle")}
      />
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
          className="mx-auto relative size-20 mb-2"
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
                className="size-10 text-primary-foreground"
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
          {tAuth("success.welcome_back", { name: derived.displayName })}
        </m.h2>

        {derived.shouldShowAvatarPrompt ? (
          <SuccessAvatarPrompt
            displayName={derived.displayName}
            avatarSrc={derived.avatarSrc}
            avatarFallback={derived.avatarFallback}
            isUpdatingAvatar={updateAvatarMutation.isPending}
            isCompleting={markWelcomeSeenMutation.isPending}
            fileInputRef={fileInputRef}
            onPickAvatar={onPickAvatar}
            onFileChange={onFileChange}
            onContinue={onContinue}
            onSkipAvatar={onSkipAvatar}
          />
        ) : (
          <SuccessRedirectNotice text={tAuth("success.welcome_redirect")} />
        )}
      </m.div>
    </LazyMotion>
  );
};

export default SuccessState;
