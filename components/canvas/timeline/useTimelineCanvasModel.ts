"use client";

// No react imports needed as we removed useMemo and useCallback
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";

// Issue and Sprint types are not required in this thin hook
import { createDateFormatter } from "@/lib/format-date";
import { createIssuesQueryOptions } from "@/queries/issue";
import { createSprintsQueryOptions } from "@/queries/sprint";

import type { TimelineSprintItemData } from "./types";
import { buildTimelineModel } from "./buildTimelineModel";

type ViewModel = {
  isLoading: boolean;
  error: boolean;
  isRetrying: boolean;
  handleRetry: () => void;
  errorState: {
    title: string;
    loadingLabel: string;
    retryLabel: string;
  };
  emptyState: {
    title: string;
    hint: string;
    unscheduledIssuesLabel: string;
    unscheduledIssuesCount: number;
    totalSprintsLabel: string;
  };
  header: {
    timelineLabel: string;
    title: string;
    subtitle: string;
    activeLabel: string;
    activeCount: number;
    upcomingLabel: string;
    upcomingCount: number;
    completedLabel: string;
    completedCount: number;
  };
  activeStep: number;
  items: TimelineSprintItemData[];
};

export function useTimelineCanvasModel(projectId: string): ViewModel {
  const tDashboard = useTranslations("dashboard");
  const locale = useLocale();
  const formatDate = createDateFormatter(locale, {
    day: "2-digit",
    month: "short",
  });

  const {
    data: sprintsData,
    isLoading: isSprintsLoading,
    error: sprintsError,
    isRefetching: isSprintsRefetching,
    refetch: refetchSprints,
  } = useQuery(createSprintsQueryOptions({ projectId, limit: 100 }));

  const {
    data: issuesData,
    isLoading: isIssuesLoading,
    error: issuesError,
    isRefetching: isIssuesRefetching,
    refetch: refetchIssues,
  } = useQuery(createIssuesQueryOptions({ projectId, limit: 100 }));

  const sprints = sprintsData?.data?.items ?? [];
  const issues = issuesData?.data?.items ?? [];

  const translate = (key: string, values?: Record<string, string | number | Date>) =>
    // bridge the strongly-typed translator to a simple function signature
    (tDashboard as unknown as (k: string, v?: Record<string, string | number | Date>) => string)(key, values);

  const { items, activeStep, header, emptyState } = buildTimelineModel({ sprints, issues, tDashboard: translate, formatDate });

  return {
    isLoading: isSprintsLoading || isIssuesLoading,
    error: Boolean(sprintsError || issuesError),
    isRetrying: isSprintsRefetching || isIssuesRefetching,
    handleRetry: () => {
      void refetchSprints();
      void refetchIssues();
    },
    errorState: {
      title: tDashboard("timeline.error"),
      loadingLabel: tDashboard("timeline.loading"),
      retryLabel: tDashboard("timeline.retry"),
    },
    emptyState,
    header,
    activeStep,
    items,
  };
}
