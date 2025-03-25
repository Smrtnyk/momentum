export interface UserProfile {
    birthDate: string;
    defaultCalorieGoal: number;
    gender: "Female" | "Male";
    height: number;
    id: string;
    name: string;
    profilePictureUrl?: string;
}
