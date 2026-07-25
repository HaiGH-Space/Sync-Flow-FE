"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CreateSprintModal from "@/components/dashboard/comp/CreateSprintModal";
import { useHeaderSprintSelect } from "./useHeaderSprintSelect";

export function HeaderSprintSelect() {
  const {
    t,
    projectId,
    selectedSprintId,
    sprintOptions,
    isDisabled,
    isLoading,
    handleSprintSelect,
    handleSprintCreated,
  } = useHeaderSprintSelect();

  return (
    <div className="flex items-center gap-2">
      {projectId ? (
        <CreateSprintModal
          projectId={projectId}
          onCreated={handleSprintCreated}
        />
      ) : null}
      <Select
        value={selectedSprintId}
        onValueChange={handleSprintSelect}
        disabled={isDisabled}
      >
        <SelectTrigger className="w-44" disabled={isDisabled}>
          <SelectValue
            placeholder={
              !projectId
                ? t("header.sprintNoProject")
                : isLoading && sprintOptions.length === 0
                  ? t("header.sprintLoading")
                  : t("header.sprintEmpty")
            }
          />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("header.sprintAll")}</SelectItem>
          {sprintOptions.map((sprint) => (
            <SelectItem key={sprint.id} value={sprint.id}>
              {sprint.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
