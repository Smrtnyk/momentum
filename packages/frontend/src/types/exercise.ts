export interface Exercise {
    description?: string;
    id: string;
    // IDs of muscles targeted by this exercise
    muscleIds: string[];
    name: string;
}
