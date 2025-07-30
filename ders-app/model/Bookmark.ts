import { AudioPartModel } from "./AudioPart";
import { UserModel } from "./user";

export interface BookmarkModel {
    id: string;
    user_id: string;
    audio_part_id: string;
    user: UserModel;
    audio_part: AudioPartModel;
    createdAt: Date;
    updatedAt: Date;
}