"use client";
import { useTranslations } from "next-intl";

type IssueDescriptionSectionProps = {
  value: string;
  onChange: (next: string) => void;
};

export function IssueDescriptionSection({
  value,
  onChange,
}: IssueDescriptionSectionProps) {
  const tDashboard = useTranslations("dashboard");

  return (
    <div>
      <h3 id="issue-description-label" className="font-medium mb-2">
        {tDashboard("issue.detail.descriptionLabel")}
      </h3>
      <textarea
        aria-labelledby="issue-description-label"
        className="w-full min-h-35 rounded-md border bg-muted/30 p-4 text-sm text-foreground/80 leading-relaxed outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        placeholder={tDashboard("issue.detail.descriptionPlaceholder")}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
