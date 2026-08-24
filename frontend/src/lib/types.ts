// ===== Auth =====
export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}

export interface MessageResponse {
    message: string;
}

export interface CurrentUser {
    UserId: string;
    authorities: string[];
}

// ===== Profile =====
export interface ProfileDto {
    userId: string;
    firstName: string | null;
    lastName: string | null;
    birthDate: string | null;
    sex: string | null;
    heightCm: number | null;
    weightKg: number | null;
    goal: string | null;
    experienceLevel: string | null;
    activityLevel: string | null;
    timezone: string | null;
    privacyLevel: string | null;
    createdAt: string | null;
    updatedAt: string | null;
}

export interface UpdateProfileRequest {
    firstName?: string;
    lastName?: string;
    birthDate?: string;
    sex?: string;
    heightCm?: number;
    weightKg?: number;
    goal?: string;
    experienceLevel?: string;
    activityLevel?: string;
    timezone?: string;
    privacyLevel?: string;
}

// ===== Catalog =====
export type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type Equipment =
    | 'BODYWEIGHT'
    | 'BARBELL'
    | 'DUMBBELL'
    | 'MACHINE'
    | 'CABLE'
    | 'KETTLEBELL'
    | 'PULL_UP_BAR'
    | 'RESISTANCE_BAND';
export type MuscleGroup =
    | 'CHEST'
    | 'BACK'
    | 'SHOULDERS'
    | 'BICEPS'
    | 'TRICEPS'
    | 'LEGS'
    | 'GLUTES'
    | 'CORE'
    | 'FOREARMS'
    | 'CALVES';

export interface ExerciseDto {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    technique: string | null;
    difficulty: Difficulty;
    equipment: Equipment;
    primaryMuscleGroup: MuscleGroup;
    secondaryMuscleGroups: MuscleGroup[];
    videoUrl: string | null;
    thumbnailUrl: string | null;
    isActive: boolean | null;
    createdAt: string | null;
    updatedAt: string | null;
}

export interface ExerciseFilterRequest {
    primaryMuscleGroup?: MuscleGroup;
    difficulty?: Difficulty;
    equipment?: Equipment;
    search?: string;
    isActive?: boolean;
}

// ===== Option maps (display labels, RU) =====
export const DIFFICULTIES: Difficulty[] = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];
export const EQUIPMENT: Equipment[] = [
    'BODYWEIGHT',
    'BARBELL',
    'DUMBBELL',
    'MACHINE',
    'CABLE',
    'KETTLEBELL',
    'PULL_UP_BAR',
    'RESISTANCE_BAND',
];
export const MUSCLE_GROUPS: MuscleGroup[] = [
    'CHEST',
    'BACK',
    'SHOULDERS',
    'BICEPS',
    'TRICEPS',
    'LEGS',
    'GLUTES',
    'CORE',
    'FOREARMS',
    'CALVES',
];

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
    BEGINNER: 'Новичок',
    INTERMEDIATE: 'Средний',
    ADVANCED: 'Продвинутый',
};

export const EQUIPMENT_LABELS: Record<Equipment, string> = {
    BODYWEIGHT: 'Вес тела',
    BARBELL: 'Штанга',
    DUMBBELL: 'Гантели',
    MACHINE: 'Тренажёр',
    CABLE: 'Блок (трос)',
    KETTLEBELL: 'Гиря',
    PULL_UP_BAR: 'Турник',
    RESISTANCE_BAND: 'Резиновая лента',
};

export const MUSCLE_GROUP_LABELS: Record<MuscleGroup, string> = {
    CHEST: 'Грудь',
    BACK: 'Спина',
    SHOULDERS: 'Плечи',
    BICEPS: 'Бицепс',
    TRICEPS: 'Трицепс',
    LEGS: 'Ноги',
    GLUTES: 'Ягодицы',
    CORE: 'Пресс (кор)',
    FOREARMS: 'Предплечья',
    CALVES: 'Икры',
};

export interface Option {
    value: string;
    label: string;
}

export const GOALS: Option[] = [
    { value: 'MUSCLE_GAIN', label: 'Набор мышечной массы' },
    { value: 'FAT_LOSS', label: 'Снижение веса' },
    { value: 'GENERAL_FITNESS', label: 'Общая физическая форма' },
    { value: 'STRENGTH', label: 'Развитие силы' },
    { value: 'ENDURANCE', label: 'Выносливость' },
];

export const EXPERIENCE_LEVELS: Option[] = [
    { value: 'BEGINNER', label: 'Новичок' },
    { value: 'INTERMEDIATE', label: 'Средний уровень' },
    { value: 'ADVANCED', label: 'Продвинутый' },
];

export const ACTIVITY_LEVELS: Option[] = [
    { value: 'SEDENTARY', label: 'Сидячий образ жизни' },
    { value: 'LIGHTLY_ACTIVE', label: 'Лёгкая активность' },
    { value: 'MODERATELY_ACTIVE', label: 'Умеренная активность' },
    { value: 'VERY_ACTIVE', label: 'Высокая активность' },
    { value: 'ATHLETE', label: 'Профессиональный спорт' },
];

export const SEX_OPTIONS: Option[] = [
    { value: 'MALE', label: 'Мужской' },
    { value: 'FEMALE', label: 'Женский' },
    { value: 'OTHER', label: 'Другое' },
];

export const PRIVACY_OPTIONS: Option[] = [
    { value: 'PUBLIC', label: 'Публичный' },
    { value: 'FRIENDS', label: 'Друзья' },
    { value: 'PRIVATE', label: 'Приватный' },
];
