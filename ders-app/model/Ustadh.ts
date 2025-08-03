

export interface UstadhModel {
    id: string;
    name: string;
    bio: string | null;
    photo_url: string | null;

    createdAt: Date;
    updatedAt: Date;
}