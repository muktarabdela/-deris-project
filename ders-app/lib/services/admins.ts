import { supabase } from "@/lib/supabase";
import { AdminModel } from "@/model/admins";
import { hashPassword, verifyPassword } from "../auth-utils";

const TABLE_NAME = 'admins';

export const adminService = {
    async upsertAdmin({
        id,
        user_name,
        first_name,
        last_name,
        password,
        role,
        total_ders,
        total_audio_parts,
        is_active,
    }: {
        id: string;
        user_name: string;
        first_name: string;
        last_name: string;
        password: string;
        role: string;
        total_ders: number;
        total_audio_parts: number;
        is_active: boolean;
    }) {
        try {
            const hashedPassword = password.includes('$') ? password : await hashPassword(password);

            const { data, error } = await supabase.from(TABLE_NAME).upsert(
                {
                    id,
                    user_name,
                    first_name,
                    last_name,
                    password: hashedPassword,
                    role,
                    total_ders,
                    total_audio_parts,
                    is_active,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                { onConflict: "id" }
            );

            if (error) {
                console.error("Supabase Upsert Error:", error);
                throw new Error(`Admin upsert failed: ${error.message}`);
            }
            return data;
        } catch (err) {
            console.error("Error during admin upsert:", err);
            throw err;
        }
    },
    // login 
    async loginAdmin(user_name: string, password: string): Promise<AdminModel | null> {
        try {
            const { data: admin, error } = await supabase
                .from(TABLE_NAME)
                .select('*')
                .eq('user_name', user_name)
                .single();

            if (error || !admin) {
                console.error("Admin not found:", error);
                return null;
            }

            // Verify the password
            const isPasswordValid = await verifyPassword(password, admin.password);

            if (!isPasswordValid) {
                return null;
            }

            // Don't return the password hash
            const { password: _, ...adminWithoutPassword } = admin;
            return adminWithoutPassword as AdminModel;
        } catch (error) {
            console.error("Error during admin login:", error);
            return null;
        }
    },


    // Add a method to verify admin credentials
    async verifyAdmin(email: string, password: string): Promise<AdminModel | null> {
        try {
            // First, find the admin by email (you'll need to add email to your AdminModel and table)
            const { data: admin, error } = await supabase
                .from(TABLE_NAME)
                .select('*')
                .eq('email', email)
                .single();

            if (error || !admin) {
                console.error("Admin not found:", error);
                return null;
            }

            // Verify the password
            const isPasswordValid = await verifyPassword(password, admin.password);

            if (!isPasswordValid) {
                return null;
            }

            // Don't return the password hash
            const { password: _, ...adminWithoutPassword } = admin;
            return adminWithoutPassword as AdminModel;
        } catch (error) {
            console.error("Error during admin verification:", error);
            return null;
        }
    },


    // isUserNameUnique
    async isUserNameUnique(user_name: string) {
        try {
            const { data, error } = await supabase.from(TABLE_NAME).select("*").eq("user_name", user_name);
            if (error) {
                console.error("Supabase Select Error:", error);
                throw new Error(`Admin select failed: ${error.message}`);
            }
            return data.length === 0;
        } catch (err) {
            console.error("Error during admin select:", err);
            throw err;
        }
    },

    async deleteAdmin(id: string) {
        try {
            const { error } = await supabase.from(TABLE_NAME).delete().eq("id", id);
            if (error) {
                console.error("Supabase Delete Error:", error);
                throw new Error(`Admin delete failed: ${error.message}`);
            }
            return true;
        } catch (err) {
            console.error("Error during admin delete:", err);
            throw err;
        }
    },

    // changer admin password
    async changeAdminPassword(id: string, newPassword: string) {
        try {
            const hashedPassword = await hashPassword(newPassword);
            const { error } = await supabase
                .from(TABLE_NAME)
                .update({ password: hashedPassword })
                .eq("id", id);

            if (error) {
                console.error("Supabase Update Error:", error);
                throw new Error(`Admin password change failed: ${error.message}`);
            }
            return true;
        } catch (err) {
            console.error("Error during admin password change:", err);
            throw err;
        }
    },

    // update admin
    async updateAdmin(id: string, admin: AdminModel) {
        try {
            const { data, error } = await supabase.from(TABLE_NAME).update(admin).eq("id", id);
            if (error) {
                console.error("Supabase Update Error:", error);
                throw new Error(`Admin update failed: ${error.message}`);
            }
            return data;
        } catch (err) {
            console.error("Error during admin update:", err);
            throw err;
        }
    },
    // get all
    async getAll() {
        try {
            const { data, error } = await supabase.from(TABLE_NAME).select("*");
            if (error) {
                console.error("Supabase Select Error:", error);
                throw new Error(`Admin select failed: ${error.message}`);
            }
            return data;
        } catch (err) {
            console.error("Error during admin select:", err);
            throw err;
        }
    },
    // delete
    async delete(id: string) {
        try {
            const { error } = await supabase.from(TABLE_NAME).delete().eq("id", id);
            if (error) {
                console.error("Supabase Delete Error:", error);
                throw new Error(`Admin delete failed: ${error.message}`);
            }
            return true;
        } catch (err) {
            console.error("Error during admin delete:", err);
            throw err;
        }
    },
}