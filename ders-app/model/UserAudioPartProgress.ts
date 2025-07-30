import { AudioPartModel } from "./AudioPart";
import { UserModel } from "./user";

export interface UserAudioPartProgressModel {
    id: string;
    user_id: string;
    audio_part_id: string;
    quiz_score: number | null;
    quiz_attempts: number;
    is_completed: boolean;
    user: UserModel;
    audio_part: AudioPartModel;
    createdAt: Date;
    updatedAt: Date;
}