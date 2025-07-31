import { DersModel } from "./Ders";

export interface CategoryModel {
    id: string;
    name: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
}
