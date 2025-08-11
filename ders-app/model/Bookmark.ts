

export interface BookmarkModel {
    id: string;
    user_id: string;
    ders_id: string | null;
    short_ders_id: string | null;
    createdAt: Date;
    updatedAt: Date;
}