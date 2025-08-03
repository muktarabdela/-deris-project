

export interface UserDersProgressModel {
    id: string;
    user_id: string;
    ders_id: string;
    status: string;
    started_at: Date;
    completed_at: Date | null;

    createdAt: Date;
    updatedAt: Date;
}