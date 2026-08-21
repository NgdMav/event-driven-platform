'use client';
import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Search, Filter } from 'lucide-react';

export default function ExercisesPage() {
    const [search, setSearch] = useState('');
    const [muscle, setMuscle] = useState('');

    const { data: exercises, isLoading } = useQuery({
        queryKey: ['exercises', search, muscle],
        queryFn: async () => {
            if (search) {
                const res = await api.get(`/catalog/exercises/search?query=${search}`);
                return res.data;
            }
            if (muscle) {
                const res = await api.post('/catalog/exercises/filter', { primaryMuscleGroup: muscle, isActive: true });
                return res.data;
            }
            const res = await api.get('/catalog/exercises');
            return res.data;
        },
    });

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Каталог упражнений</h1>

            {/* Панель поиска и фильтров */}
            <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Поиск упражнения..."
                        className="w-full pl-10 p-2 border rounded"
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setMuscle(''); }}
                    />
                </div>
                <select
                    className="p-2 border rounded"
                    value={muscle}
                    onChange={(e) => { setMuscle(e.target.value); setSearch(''); }}
                >
                    <option value="">Все мышцы</option>
                    <option value="CHEST">Грудь</option>
                    <option value="BACK">Спина</option>
                    <option value="LEGS">Ноги</option>
                    <option value="SHOULDERS">Плечи</option>
                </select>
            </div>

            {/* Список упражнений */}
            {isLoading ? (
                <div>Загрузка...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {exercises?.map((ex: any) => (
                        <div key={ex.id} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
                            <h3 className="text-lg font-bold mb-2">{ex.name}</h3>
                            <div className="flex gap-2 mb-3">
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{ex.primaryMuscleGroup}</span>
                                <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">{ex.difficulty}</span>
                                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">{ex.equipment}</span>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-3">{ex.description}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}