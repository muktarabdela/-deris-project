

export enum UserRole {
    STUDENT = 'STUDENT',
    ADMIN = 'ADMIN'
}

// just define basic user model in here
export interface UserModel {
    id: string;
    telegram_user_id: bigint;
    first_name: string;
    username: string | null;
    profile_picture_url: string | null;
    role: UserRole;
    points: number;
    current_ders_id: string | null;
    is_onboarding_completed: boolean;
    preferences: {
        dark_mode: boolean;
        notifications: boolean;
        language: string;
    };
    createdAt: Date;
    updatedAt: Date;
}
