import { useInfiniteQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { createMyWorkspacesInfiniteQueryOptions } from '@/queries/workspace'

export const useCurrentWorkspace = () => {
    const params = useParams<{ workspaceId?: string }>()
    const workspaceId = params?.workspaceId

    const {
        data,
        isPending,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useInfiniteQuery(createMyWorkspacesInfiniteQueryOptions({ limit: 20, includeTotal: false }))

    const workspaceList = data?.pages.flatMap((page) => page.data.items) ?? []
    const activeWorkspace = workspaceList.find(w => w.id === workspaceId)

    return {
        workspaceList,
        activeWorkspace,
        workspaceId,
        isPending,
        error,
        fetchNextPage,
        hasNextPage: !!hasNextPage,
        isFetchingNextPage
    }
}