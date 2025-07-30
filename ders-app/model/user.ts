import { BookmarkModel } from "./Bookmark";
import { UserAudioPartProgressModel } from "./UserAudioPartProgress";
import { UserDersProgressModel } from "./UserDersProgress";

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
    ders_progress: UserDersProgressModel[];
    audio_part_progresses: UserAudioPartProgressModel[];
    bookmarks: BookmarkModel[];
    createdAt: Date;
    updatedAt: Date;
}
