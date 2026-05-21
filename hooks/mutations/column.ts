import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import type { ApiResponse } from '@/lib/api/api';
import { columnService } from '@/lib/api/column';
import type { Column } from '@/lib/api/column';
import { columnKeys } from '@/queries/column';

interface UpdateColumnOrderVars {
	id: string;
	order: number;
	originalOrder: number;
}

interface RebalanceColumnsVars {
	updates: Array<{ id: string; order: number }>;
	previousColumns: Column[];
}

interface UpdateColumnVars {
	id: string;
	name: string;
}

interface DeleteColumnVars {
	id: string;
}

export const useUpdateColumnOrderMutation = (projectId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, order }: UpdateColumnOrderVars) =>
			columnService.updateColumn({ projectId, columnId: id, columnData: { order } }),
		onMutate: async () => {
			await queryClient.cancelQueries({ queryKey: columnKeys.list(projectId) });
		},
		onSuccess: (updatedColumn) => {
			queryClient.setQueryData<ApiResponse<Column[]>>(columnKeys.list(projectId), (old) => {
				if (!old) return old;
				return {
					...old,
					data: old.data.map((col) => (col.id === updatedColumn.data.id ? updatedColumn.data : col)),
				};
			});
		},
		onError: (_err, vars) => {
			toast.error('Failed to reorder columns. Please try again.');
			queryClient.setQueryData<ApiResponse<Column[]>>(columnKeys.list(projectId), (old) => {
				if (!old) return old;
				const restored = old.data.map((col) =>
					col.id === vars.id ? { ...col, order: vars.originalOrder } : col,
				);
				return { ...old, data: restored.toSorted((a, b) => a.order - b.order) };
			});
		},
	});
};

export const useRebalanceColumnsMutation = (projectId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ updates }: RebalanceColumnsVars) => {
			await Promise.all(
				updates.map((update) =>
					columnService.updateColumn({
						projectId,
						columnId: update.id,
						columnData: { order: update.order },
					}),
				),
			);
		},
		onMutate: async () => {
			await queryClient.cancelQueries({ queryKey: columnKeys.list(projectId) });
		},
		onError: (_err, vars) => {
			toast.error('Failed to reorder columns. Please try again.');
			queryClient.setQueryData<ApiResponse<Column[]>>(columnKeys.list(projectId), (old) => {
				if (!old) return old;
				return { ...old, data: vars.previousColumns.toSorted((a, b) => a.order - b.order) };
			});
		},
	});
};

export const useUpdateColumnMutation = (projectId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, name }: UpdateColumnVars) =>
			columnService.updateColumn({ projectId, columnId: id, columnData: { name } }),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: columnKeys.list(projectId) });
		},
		onError: () => {
			toast.error('Failed to update column. Please try again.');
		},
	});
};

export const useDeleteColumnMutation = (projectId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id }: DeleteColumnVars) => columnService.deleteColumn({ projectId, columnId: id }),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: columnKeys.list(projectId) });
		},
		onError: () => {
			toast.error('Failed to delete column. Please try again.');
		},
	});
};
