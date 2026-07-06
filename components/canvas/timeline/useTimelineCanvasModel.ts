"use client";

import { useMemo, useCallback } from "react";
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

  const sprintsQuery = useQuery(createSprintsQueryOptions({ projectId, limit: 100 }));
  const issuesQuery = useQuery(createIssuesQueryOptions({ projectId, limit: 100 }));

  const sprints = useMemo(
    () => sprintsQuery.data?.data?.items ?? [],
    [sprintsQuery.data?.data],
  );
  const issues = useMemo(
    () => issuesQuery.data?.data?.items ?? [],
    [issuesQuery.data?.data],
  );

  const translate = useCallback(
    (key: string, values?: Record<string, string | number | Date>) =>
      // bridge the strongly-typed translator to a simple function signature
      (tDashboard as unknown as (k: string, v?: Record<string, string | number | Date>) => string)(key, values),
    [tDashboard],
  );

  const { items, activeStep, header, emptyState } = useMemo(
    () => buildTimelineModel({ sprints, issues, tDashboard: translate, formatDate }),
    [sprints, issues, translate, formatDate],
  );

  return {
    isLoading: sprintsQuery.isLoading || issuesQuery.isLoading,
    error: Boolean(sprintsQuery.error || issuesQuery.error),
    isRetrying: sprintsQuery.isRefetching || issuesQuery.isRefetching,
    handleRetry: () => {
      void sprintsQuery.refetch();
      void issuesQuery.refetch();
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
