import { api } from '@/lib/api';
import type { ExerciseDto, ExerciseFilterRequest } from '@/lib/types';

export const catalogClient = {
    getAll: () => api.get<ExerciseDto[]>('/catalog/exercises').then((r) => r.data),
    getBySlug: (slug: string) =>
        api.get<ExerciseDto>(`/catalog/exercises/slug/${slug}`).then((r) => r.data),
    getById: (id: string) =>
        api.get<ExerciseDto>(`/catalog/exercises/${id}`).then((r) => r.data),
    filter: (req: ExerciseFilterRequest) =>
        api.post<ExerciseDto[]>('/catalog/exercises/filter', req).then((r) => r.data),
    search: (query: string) =>
        api
            .get<ExerciseDto[]>('/catalog/exercises/search', { params: { query } })
            .then((r) => r.data),
};
