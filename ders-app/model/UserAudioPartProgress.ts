

export interface UserAudioPartProgressModel {
    id: string;
    user_id: string;
    audio_part_id: string;
    quiz_score: number | null;
    quiz_attempts: number;
    is_completed: boolean;

    completedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}