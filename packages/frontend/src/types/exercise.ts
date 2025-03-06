export interface Exercise {
    description?: string;
    exerciseId: string;
    muscleIds: string[];
    name: string;
}

export interface Muscle {
    exerciseId: string;
    name: string;
}
