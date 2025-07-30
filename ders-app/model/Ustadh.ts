import { DersModel } from "./Ders";


export interface UstadhModel {
    id: string;
    name: string;
    bio: string | null;
    photo_url: string | null;
    derses: DersModel[];

    createdAt: Date;
    updatedAt: Date;
}