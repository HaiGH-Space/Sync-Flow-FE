import type { Issue } from "@/lib/api/issue";
import type { Sprint } from "@/lib/api/sprint";
import type {
  TimelineSprintItemData,
  SprintPhase,
  TimelineBadgeVariant,
} from "./types";

type BuilderArgs = {
  sprints: Sprint[];
  issues: Issue[];
  tDashboard: (key: string, values?: Record<string, string | number | Date>) => string
  formatDate: (d: Date) => string;
};

function toDate(value: string | null) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function calculateProgress(startDate: Date | null, endDate: Date | null) {
  if (!startDate || !endDate) return null;
  const start = startDate.getTime();
  const end = endDate.getTime();
  if (end <= start) return null;
  const now = Date.now();
  return Math.max(0, Math.min(100, ((now - start) / (end - start)) * 100));
}

function getSprintPhase(
  startDate: Date | null,
  endDate: Date | null,
): SprintPhase {
  if (!startDate || !endDate) return "unscheduled";
  const now = Date.now();
  if (now < startDate.getTime()) return "upcoming";
  if (now > endDate.getTime()) return "completed";
  return "active";
}

export function buildTimelineModel({
  sprints,
  issues,
  tDashboard,
  formatDate,
}: BuilderArgs) {
  const issuesBySprint = new Map<string, Issue[]>();
  for (const issue of issues) {
    if (!issue.sprintId) continue;
    const current = issuesBySprint.get(issue.sprintId) ?? [];
    current.push(issue);
    issuesBySprint.set(issue.sprintId, current);
  }
  for (const g of issuesBySprint.values())
    g.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  const sprintCards = sprints.toSorted((a, b) => {
    const aStart = toDate(a.startDate)?.getTime() ?? Number.MAX_SAFE_INTEGER;
    const bStart = toDate(b.startDate)?.getTime() ?? Number.MAX_SAFE_INTEGER;
    if (aStart !== bStart) return aStart - bStart;
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  }).map((sprint) => {
      const sprintIssues = issuesBySprint.get(sprint.id) ?? [];
      const startDate = toDate(sprint.startDate);
      const endDate = toDate(sprint.endDate);
      const phase = getSprintPhase(startDate, endDate);

      return {
        sprint,
        sprintIssues,
        progress: calculateProgress(startDate, endDate),
        phase,
        statusVariant: (sprint.status === "ACTIVE"
          ? "default"
          : sprint.status === "COMPLETED"
            ? "secondary"
            : "outline") as TimelineBadgeVariant,
        phaseVariant: (phase === "active"
          ? "default"
          : phase === "completed"
            ? "secondary"
            : "outline") as TimelineBadgeVariant,
        statusLabel:
          sprint.status === "ACTIVE"
            ? tDashboard("timeline.status.active")
            : sprint.status === "COMPLETED"
              ? tDashboard("timeline.status.completed")
              : tDashboard("timeline.status.planned"),
        phaseLabel:
          phase === "active"
            ? tDashboard("timeline.phase.active")
            : phase === "completed"
              ? tDashboard("timeline.phase.completed")
              : phase === "upcoming"
                ? tDashboard("timeline.phase.upcoming")
                : tDashboard("timeline.phase.unscheduled"),
        dateLabel:
          startDate && endDate
            ? `${formatDate(startDate)} - ${formatDate(endDate)}`
            : tDashboard("timeline.card.noDate"),
      };
    });

  const items: TimelineSprintItemData[] = sprintCards.map(
    ({
      sprint,
      sprintIssues,
      progress,
      phase,
      dateLabel,
      statusVariant,
      phaseVariant,
      statusLabel,
      phaseLabel,
    }) => {
      const overflowCount = Math.max(0, sprintIssues.length - 2);
      return {
        id: sprint.id,
        title: sprint.name,
        dateLabel,
        progress,
        phase,
        phaseLabel,
        phaseVariant,
        statusLabel,
        statusVariant,
        issues: sprintIssues,
        issueCount: sprintIssues.length,
        issueCountLabel: tDashboard("timeline.card.issueCount", {
          count: String(sprintIssues.length),
        }),
        progressLabel: tDashboard("timeline.card.durationLabel"),
        noIssuesLabel: tDashboard("timeline.card.noIssues"),
        statusFooterLabel: tDashboard("timeline.card.statusLabel"),
        overflowLabel: tDashboard("timeline.card.overflow", {
          count: String(overflowCount),
        }),
        visibleIssues: sprintIssues.slice(0, 2),
        overflowCount,
      };
    },
  );

  const activeStep = Math.max(
    1,
    items.findIndex((it) => it.phase === "active") + 1,
  );
  const activeSprints = items.filter((i) => i.phase === "active").length;
  const upcomingSprints = items.filter((i) => i.phase === "upcoming").length;
  const completedSprints = items.filter((i) => i.phase === "completed").length;
  const unscheduledIssuesCount = issues.filter(
    (issue) => !issue.sprintId,
  ).length;

  return {
    items,
    activeStep,
    header: {
      timelineLabel: tDashboard("navigation.timeline"),
      title: tDashboard("timeline.title"),
      subtitle: tDashboard("timeline.subtitle"),
      activeLabel: tDashboard("timeline.phase.active"),
      activeCount: activeSprints,
      upcomingLabel: tDashboard("timeline.phase.upcoming"),
      upcomingCount: upcomingSprints,
      completedLabel: tDashboard("timeline.phase.completed"),
      completedCount: completedSprints,
    },
    emptyState: {
      title: tDashboard("timeline.emptyTitle"),
      hint: tDashboard("timeline.emptyHint"),
      unscheduledIssuesLabel: tDashboard("timeline.summary.unscheduledIssues"),
      unscheduledIssuesCount,
      totalSprintsLabel: tDashboard("timeline.summary.totalSprints"),
    },
  };
}
