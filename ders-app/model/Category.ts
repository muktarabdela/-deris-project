import { DersModel } from "./Ders";

export interface CategoryModel {
    id: string;
    name: string;
    description: string | null;
    derses: DersModel[];
    createdAt: Date;
    updatedAt: Date;
}
