export interface DersModel {
    id: string;
    title: string;
    description: string;
    thumbnail_url: string | null;
    book_pdf_url: string | null;
    is_published: boolean;
    order: number;
    ustadh_id: string;
    category_id: string;
    createdAt: Date;
    updatedAt: Date;
}