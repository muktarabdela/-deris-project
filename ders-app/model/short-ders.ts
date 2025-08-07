
export interface ShortDersModel {
    id: string;
    title: string;
    description: string;
    telegram_file_id: string | null;
    is_published: boolean;
    order: number;
    ustadh_id: string;
    category_id: string;
    createdAt: Date;
    updatedAt: Date;
}