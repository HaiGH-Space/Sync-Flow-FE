"use client";

// React is not directly referenced except via JSX

import { Timeline } from "@/components/ui/timeline";

import TimelineSprintItem from "./TimelineSprintItem";
import type { TimelineSprintItemData } from "./types";

type TimelineSprintRailProps = {
  activeStep: number;
  items: TimelineSprintItemData[];
};

function TimelineSprintRail({ activeStep, items }: TimelineSprintRailProps) {
  return (
    <Timeline
      value={activeStep}
      orientation="horizontal"
      className="w-max max-w-none items-start"
    >
      {items.map((item, index) => (
        <TimelineSprintItem key={item.id} step={index + 1} item={item} />
      ))}
    </Timeline>
  );
}

export default TimelineSprintRail;
