"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";

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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Trash } from "lucide-react";
import { quizService } from "@/lib/services/quiz";
import { QuizModel } from "@/model/Quiz";
import { quizQuestionService } from "@/lib/services/quiz-questions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useData } from "@/context/dataContext";



interface QuizFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    quiz?: QuizModel | null;
    onSuccess: () => void;
}

export function QuizFormDialog({
    open,
    onOpenChange,
    quiz,
    onSuccess,
}: QuizFormDialogProps) {
    const { audioParts } = useData();
    // console.log(audioParts)
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const form = useForm<QuizModel>({
        defaultValues: {
            name: "",
            description: "",
            audio_part_id: undefined,  // Change null to undefined
        }
    });


    useEffect(() => {
        if (quiz) {
            form.reset({
                name: quiz.name,
                audio_part_id: quiz.audio_part_id,
                description: quiz.description || "",
            });
        } else {
            form.reset({
                name: "",
                audio_part_id: undefined,
                description: "",
            });
        }
    }, [quiz, open, form]);
    const validateForm = (data: QuizModel) => {
        const errors: Record<string, string> = {};
        if (!data.name || data.name.trim().length < 2) {
            errors.name = "Name must be at least 2 characters";
        }
        if (!data.description || data.description.trim().length < 2) {
            errors.description = "Description must be at least 2 characters";
        }
        if (!data.audio_part_id) {
            errors.audio_part_id = "Audio part is required";
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    }
    async function onSubmit(values: QuizModel) {
        if (!validateForm(values)) {
            return;
        }
        try {
            setIsSubmitting(true);
            if (quiz) {
                await quizService.update(quiz.id, values);
            } else {
                await quizService.create(values);
            }
            onSuccess();
            toast.success("Quiz saved successfully");
        } catch (error) {
            console.error("Error saving quiz:", error);
            toast.error("Failed to save quiz");
        } finally {
            setIsSubmitting(false);
        }
    }
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[650px]">
                <DialogHeader>
                    <DialogTitle>{quiz ? "Edit Quiz" : "Add New Quiz"}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {/* Quiz Details Fields */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter quiz name" {...field} value={field.value || ''} onChange={field.onChange} className={formErrors.name ? "border-destructive" : ""} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="audio_part_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Audio Part</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select an audio part" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {audioParts?.map((audioPart: any) => (
                                                <SelectItem key={audioPart.id} value={audioPart.id}>
                                                    {audioPart.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Enter quiz description"
                                            className={`min-h-[100px] ${formErrors.description ? "border-destructive" : ""}`}
                                            {...field}
                                            value={field.value || ''}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                {quiz ? "Update" : "Create"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}