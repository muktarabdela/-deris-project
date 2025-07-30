import { DersModel } from "./Ders";
import { QuizModel } from "./Quiz";
import { BookmarkModel } from "./Bookmark";
import { UserAudioPartProgressModel } from "./UserAudioPartProgress";

export interface AudioPartModel {
    id: string;
    title: string;
    telegram_message_link: string;
    telegram_file_id: string | null;
    duration_in_seconds: number | null;
    order: number;
    ders_id: string;
    ders: DersModel;
    quiz: QuizModel | null;
    user_progress: UserAudioPartProgressModel[];
    bookmarks: BookmarkModel[];
    createdAt: Date;
    updatedAt: Date;
}