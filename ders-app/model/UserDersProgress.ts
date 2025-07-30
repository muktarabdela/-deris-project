import { DersModel } from "./Ders";
import { UserModel } from "./user";

export interface UserDersProgressModel {
    id: string;
    user_id: string;
    ders_id: string;
    status: string;
    started_at: Date;
    completed_at: Date | null;
    user: UserModel;
    ders: DersModel;
    createdAt: Date;
    updatedAt: Date;
}