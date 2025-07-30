import { AudioPartModel } from "./AudioPart";
import { CategoryModel } from "./Category";
import { UserDersProgressModel } from "./UserDersProgress";
import { UstadhModel } from "./Ustadh";

export interface DersModel {
    id: string;
    title: string;
    description: string;
    thumbnail_url: string | null;
    book_pdf_url: string | null;
    is_published: boolean;
    order: number;
    ustadh_id: string;
    ustadh: UstadhModel;
    category_id: string;
    category: CategoryModel;
    audio_parts: AudioPartModel[];
    user_progress: UserDersProgressModel[];
    createdAt: Date;
    updatedAt: Date;
}