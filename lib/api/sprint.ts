import { api, ApiResponse, PaginatedData, PaginationQuery } from "./api"

type SprintStatus = 'PLANNED' | 'ACTIVE' | 'COMPLETED'

export interface Sprint {
    id: string
    name: string
    goal: string | null
    startDate: string | null
    endDate: string | null
    projectId: string
    createdAt: string
    updatedAt: string
    status: SprintStatus
}

type CreateSprint = Omit<Sprint, 'id' | 'createdAt' | 'updatedAt' | 'status'>

interface DeleteSprintRequest {
    projectId: string
    sprintId: string
}

interface UpdateSprintRequest {
    projectId: string
    sprintId: string
    sprint: Partial<CreateSprint>
}

interface CreateSprintRequest {
    projectId: string
    sprint: CreateSprint
}

async function getSprint({
  projectId,
  page,
  limit,
}: {
  projectId: string;
} & PaginationQuery): Promise<ApiResponse<PaginatedData<Sprint>>> {
  const searchParams = new URLSearchParams();
  if (page) searchParams.append("page", String(page));
  if (limit) searchParams.append("limit", String(limit));
  const queryString = searchParams.toString();
  return api.get<PaginatedData<Sprint>>(
    `projects/${projectId}/sprints${queryString ? `?${queryString}` : ""}`,
  );
}
async function deleteSprint({ projectId, sprintId }: DeleteSprintRequest) {
    return api.delete(`projects/${projectId}/sprints/${sprintId}`)
}

async function createSprint({ projectId, sprint }: CreateSprintRequest) {
    return api.post<Sprint>(`projects/${projectId}/sprints`, sprint)
}
async function updateSprint({ projectId, sprintId, sprint }: UpdateSprintRequest) {
    return api.patch<Sprint>(`projects/${projectId}/sprints/${sprintId}`, sprint)
}
export const sprintService = {
    getSprint,
    deleteSprint,
    createSprint,
    updateSprint
}