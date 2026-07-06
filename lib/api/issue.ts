import { api, ApiResponse, PaginatedData, PaginationQuery } from "./api";
import { PROJECT_BASE_URL } from "./project";

export const ISSUE_BASE_URL = '/issues';

export interface Issue {
    id: string;
    number: number;
    title: string;
    description: string;
    priority: Priority;
    order: number;
    columnId: string;
    projectId: string;
    assigneeId: string | null;
    reporterId: string;
    sprintId: string | null;
    createdAt: string;
    updatedAt: string;
}
export const Priority = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
} as const;

export type Priority = typeof Priority[keyof typeof Priority];

export type CreateIssue = {
    columnId: string
    title: string
    priority: Priority
    assigneeId?: string | null
    description?: string
    sprintId?: string | null
    order: number
}

type UpdateIssue = Partial<CreateIssue> & {
    order?: number
    sprintId?: string | null
}

async function getIssuesByProjectId({
  projectId,
  page,
  limit,
}: {
  projectId: string;
} & PaginationQuery): Promise<ApiResponse<PaginatedData<Issue>>> {
  const searchParams = new URLSearchParams();
  if (page) searchParams.append("page", String(page));
  if (limit) searchParams.append("limit", String(limit));
  const queryString = searchParams.toString();
  return api.get<PaginatedData<Issue>>(
    `${PROJECT_BASE_URL}/${projectId}${ISSUE_BASE_URL}${queryString ? `?${queryString}` : ""}`,
  );
}

async function getIssueById({ projectId, issueId }: { projectId: string; issueId: string }) {
    return api.get<Issue>(`${PROJECT_BASE_URL}/${projectId}${ISSUE_BASE_URL}/${issueId}`);
}

async function createIssue({ projectId, issueData }: { projectId: string; issueData: CreateIssue }) {
    return api.post<Issue>(`${PROJECT_BASE_URL}/${projectId}${ISSUE_BASE_URL}`, issueData);
}

async function updateIssue({ projectId, issueId, issueData }: { projectId: string; issueId: string; issueData: UpdateIssue }) {
    return api.patch<Issue>(`${PROJECT_BASE_URL}/${projectId}${ISSUE_BASE_URL}/${issueId}`, issueData);
}

async function deleteIssue({ projectId, issueId }: { projectId: string; issueId: string }) {
    return api.delete(`${PROJECT_BASE_URL}/${projectId}${ISSUE_BASE_URL}/${issueId}`);
}

export const issueService = {
    getIssuesByProjectId,
    createIssue,
    updateIssue,
    deleteIssue,
    getIssueById,
}