import { useTranslations } from "next-intl";
import { ChannelCallHeaderButton } from "@/components/channel/ChannelCallHeaderButton";

type ChannelHeaderProps = {
  title?: string;
  statusLabel?: string;
  memberCount?: number;
  workspaceId?: string;
  channelId?: string;
};

export function ChannelHeader({
  title,
  statusLabel,
  memberCount = 12,
  workspaceId,
  channelId,
}: ChannelHeaderProps) {
  const t = useTranslations("dashboard");
  const resolvedTitle = title ?? t("chatRightPanel.channelTitle");
  const resolvedStatusLabel = statusLabel ?? t("chatRightPanel.onlineStatus");
  return (
    <div className="flex items-center justify-between border-b border-border/70 pb-4">
      <div>
        <h1 className="text-lg font-semibold">{resolvedTitle}</h1>
      </div>
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        {workspaceId && channelId && (
          <ChannelCallHeaderButton workspaceId={workspaceId} channelId={channelId} />
        )}
        <div className="hidden items-center gap-2 md:flex">
          <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-emerald-600">
            {resolvedStatusLabel}
          </span>
          <span>
            {t("chatRightPanel.membersCount", { count: String(memberCount) })}
          </span>
        </div>
      </div>
    </div>
  );
}

