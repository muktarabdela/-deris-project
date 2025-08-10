"use client";
import { AdminModel } from "@/model/admins";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { adminService } from "@/lib/services/admins";
import { Switch } from "../ui/switch";

interface AdminFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    admin?: AdminModel | null;
    onSuccess: () => void;
}

export function AdminFormDialog({
    open,
    onOpenChange,
    admin,
    onSuccess,
}: AdminFormDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const form = useForm<AdminModel>({
        defaultValues: {
            user_name: "",
            first_name: "",
            last_name: "",
            password: "",
            role: "ADMIN",
            is_active: false,
            total_ders: 0,
            total_audio_parts: 0,
        },
    });

    const validateForm = (data: AdminModel) => {
        const errors: Record<string, string> = {};
        if (!data.user_name || data.user_name.trim().length < 2) {
            errors.user_name = "User name must be at least 2 characters";
        }
        if (!data.first_name || data.first_name.trim().length < 2) {
            errors.first_name = "First name must be at least 2 characters";
        }
        if (!data.last_name || data.last_name.trim().length < 2) {
            errors.last_name = "Last name must be at least 2 characters";
        }
        if (!data.password || data.password.trim() === '') {
            errors.password = "Password is required";
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    useEffect(() => {
        if (admin) {
            form.reset({
                user_name: admin.user_name,
                first_name: admin.first_name,
                last_name: admin.last_name,
                password: admin.password,
                role: admin.role,
                is_active: admin.is_active,
                total_ders: admin.total_ders,
                total_audio_parts: admin.total_audio_parts,
            });
        } else {
            form.reset({
                user_name: "",
                first_name: "",
                last_name: "",
                password: "",
                role: "ADMIN",
                is_active: false,
                total_ders: 0,
                total_audio_parts: 0,
            });
        }
        setFormErrors({});
    }, [admin, open, form]);

    async function onSubmit(data: AdminModel) {
        if (!validateForm(data)) {
            console.log(formErrors);
            return;
        }
        const isUserNameUnique = await adminService.isUserNameUnique(data.user_name);
        if (!isUserNameUnique) {
            toast.error("User name already exists");
            return;
        }
        try {
            setIsSubmitting(true);
            if (admin) {
                await adminService.updateAdmin(admin.id, data);
            } else {
                await adminService.upsertAdmin(data);
            }
            onSuccess();
            toast.success(`Admin ${admin ? 'updated' : 'created'} successfully`);
            onOpenChange(false);
        } catch (error) {
            console.error('Error saving admin:', error);
            toast.error(`Failed to ${admin ? 'update' : 'create'} admin`);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{admin ? "Edit Admin" : "Add New Admin"}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="user_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>User Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter user name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="first_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter first name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="last_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter last name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Enter password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="is_active"
                            render={({ field }) => (
                                <FormItem className="flex items-center space-x-2 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>Is active</FormLabel>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    "Save"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}