import { describe, it, expect, vi } from "vitest";

vi.mock("@/i18n/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => "/",
}));

vi.mock("next/navigation", () => ({
  useParams: () => ({}),
}));

import { getWorkspaceRole } from "./use-navigation-sidebar";
import type { Workspace } from "@/lib/api/workspace";

describe("getWorkspaceRole", () => {
  it("should return OWNER when profileId matches workspace ownerId", () => {
    const workspace = { id: "ws-1", ownerId: "user-1", members: [] } as unknown as Workspace;
    expect(getWorkspaceRole(workspace, "user-1")).toBe("OWNER");
  });

  it("should return member role when profileId is in members array", () => {
    const workspace = {
      id: "ws-1",
      ownerId: "user-1",
      members: [{ userId: "user-2", role: "ADMIN" }],
    } as unknown as Workspace;
    expect(getWorkspaceRole(workspace, "user-2")).toBe("ADMIN");
  });

  it("should default to MEMBER when workspace or profile is missing", () => {
    expect(getWorkspaceRole(undefined, "user-1")).toBe("MEMBER");
  });
});
