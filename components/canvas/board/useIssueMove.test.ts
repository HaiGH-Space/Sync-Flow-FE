import { describe, it, expect, vi, beforeEach } from "vitest";
import { useIssueMove } from "./useIssueMove";
import { QueryClient } from "@tanstack/react-query";

let effectCallback: (() => void | (() => void)) | undefined;

vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react")>();
  return {
    ...actual,
    useRef: (initialValue: unknown) => ({ current: initialValue }),
    useEffect: vi.fn((cb: () => void | (() => void)) => {
      effectCallback = cb;
    }),
  };
});

const mockMutate = vi.fn();
const mockUseQueryClient = vi.fn();

vi.mock("@tanstack/react-query", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-query")>();
  return {
    ...actual,
    useQueryClient: () => mockUseQueryClient(),
    useMutation: (options: Record<string, unknown>) => {
      return {
        mutate: mockMutate,
        ...options,
      };
    },
  };
});

describe("useIssueMove", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    effectCallback = undefined;
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    mockUseQueryClient.mockReturnValue(queryClient);
  });

  it("should initialize hook and return flushPendingIssueUpdates and handleTaskDrop", () => {
    const result = useIssueMove({ projectId: "proj-1" });
    expect(typeof result.flushPendingIssueUpdates).toBe("function");
    expect(typeof result.handleTaskDrop).toBe("function");
  });

  it("should execute cleanup effect on unmount without throwing errors", () => {
    useIssueMove({ projectId: "proj-1" });
    expect(effectCallback).toBeDefined();
    if (effectCallback) {
      const cleanup = effectCallback();
      if (cleanup) expect(() => cleanup()).not.toThrow();
    }
  });

  it("should return false when drag event is canceled", () => {
    const { handleTaskDrop } = useIssueMove({ projectId: "proj-1" });
    const handled = handleTaskDrop({
      operation: { source: undefined, target: undefined },
      canceled: true,
    } as never);
    expect(handled).toBe(false);
  });
});
