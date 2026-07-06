import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { createMyWorkspacesQueryOptions } from '@/queries/workspace'

export const useCurrentWorkspace = () => {
    const params = useParams<{ workspaceId?: string }>()
    const workspaceId = params.workspaceId

    const { data: workspaceResponse, isPending, error } = useQuery(createMyWorkspacesQueryOptions({ limit: 100 }))
    const workspaceList = workspaceResponse?.data?.items
    const activeWorkspace = workspaceList?.find(w => w.id === workspaceId)
    return {
        workspaceList,
        activeWorkspace,
        workspaceId,
        isPending,
        error
    }
}