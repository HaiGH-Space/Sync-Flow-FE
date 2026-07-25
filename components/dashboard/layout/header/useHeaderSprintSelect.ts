"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useDashboard } from "@/lib/store/use-dashboard";
import { createSprintsQueryOptions } from "@/queries/sprint";
import type { Sprint } from "@/lib/api/sprint";

const EMPTY_SPRINTS: Sprint[] = [];

export function useHeaderSprintSelect() {
  const t = useTranslations("dashboard");
  const { projectId } = useParams<{ projectId?: string }>();
  const selectedSprintId = useDashboard(
    (state) => state.selectedSprintIdByProject[projectId ?? ""] ?? "all",
  );
  const setSelectedSprintId = useDashboard(
    (state) => state.setSelectedSprintId,
  );

  const { data: sprintsResponse, isLoading, isSuccess } = useQuery(
    createSprintsQueryOptions(
      { projectId: projectId ?? "", limit: 100 },
      {
        enabled: !!projectId,
      },
    ),
  );

  const sprintOptions = sprintsResponse?.data?.items ?? EMPTY_SPRINTS;
  const isDisabled = !projectId;

  useEffect(() => {
    if (!isSuccess || selectedSprintId === "all") {
      return;
    }

    const exists = sprintOptions.some(
      (sprint) => sprint.id === selectedSprintId,
    );
    if (!exists) {
      setSelectedSprintId(projectId ?? "", "all");
    }
  }, [projectId, selectedSprintId, setSelectedSprintId, sprintOptions, isSuccess]);

  const handleSprintSelect = (value: string) => {
    setSelectedSprintId(projectId ?? "", value);
  };

  const handleSprintCreated = (sprintId: string) => {
    if (projectId) {
      setSelectedSprintId(projectId, sprintId);
    }
  };

  return {
    t,
    projectId,
    selectedSprintId,
    sprintOptions,
    isDisabled,
    isLoading,
    handleSprintSelect,
    handleSprintCreated,
  };
}
