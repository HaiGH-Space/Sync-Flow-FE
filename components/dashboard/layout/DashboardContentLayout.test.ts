import { describe, it, expect } from "vitest";
import { getSidebarActiveStates } from "./DashboardContentLayout";

describe("getSidebarActiveStates", () => {
  it("should return default fallback states before hydration to prevent SSR mismatch", () => {
    const states = getSidebarActiveStates(false, false, true);
    expect(states.activeSidebarLeft).toBe(true);
    expect(states.activeSidebarRight).toBe(false);
  });

  it("should return persisted store states after hydration", () => {
    const states = getSidebarActiveStates(true, false, true);
    expect(states.activeSidebarLeft).toBe(false);
    expect(states.activeSidebarRight).toBe(true);
  });
});
