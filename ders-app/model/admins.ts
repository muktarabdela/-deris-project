export interface AdminModel {
    id: string;
    user_name: string;
    first_name: string;
    last_name: string;

    password: string;
    role: string;
    is_active: boolean;
    total_ders: number;
    total_audio_parts: number;
}   