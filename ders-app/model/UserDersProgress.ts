

export interface UserDersProgressModel {
    id: string;
    user_id: string;
    ders_id: string;
    status: string;
    startedAt: Date;
    completedAt: Date | null;

    createdAt: Date;
    updatedAt: Date;
}