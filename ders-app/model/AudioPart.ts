export interface AudioPartModel {
    id: string;
    title: string;
    is_published: boolean;
    telegram_message_link: string;
    telegram_file_id: string | null;
    duration_in_seconds: number | null;
    order: number;
    ders_id: string;
    quiz_id: string | null;
    createdAt: Date;
    updatedAt: Date;
}