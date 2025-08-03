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
import { QuizModel } from "@/model/Quiz";
import { quizQuestionService } from "@/lib/services/quiz-questions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useData } from "@/context/dataContext";
import { QuizQuestionModel } from "@/model/QuizQuestion";



interface QuizQuestionFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    quizQuestion?: QuizQuestionModel | null;
    quiz?: QuizModel | null;
    onSuccess: () => void;
}

export function QuizQuestionFormDialog({
    open,
    onOpenChange,
    quizQuestion,
    onSuccess,
}: QuizQuestionFormDialogProps) {
    const { quizzes } = useData();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const form = useForm<QuizQuestionModel>({
        defaultValues: {
            question: "",
            options: [],
            correct_answer: "",
            explanation: "",
            quiz_id: "",

        }
    });


    useEffect(() => {
        if (quizQuestion) {
            form.reset({
                question: quizQuestion.question,
                options: quizQuestion.options || [],
                correct_answer: quizQuestion.correct_answer,
                explanation: quizQuestion.explanation || "",
                quiz_id: quizQuestion.quiz_id || "",
            });
        } else {
            form.reset({
                question: "",
                options: [],
                correct_answer: "",
                explanation: "",
                quiz_id: "",
            });
        }
    }, [quizQuestion, open, form]);

    const validateForm = (data: QuizQuestionModel) => {
        const errors: Record<string, string> = {};

        if (!data.question || data.question.trim().length < 2) {
            errors.question = "Question must be at least 2 characters.";
        }

        // Check for at least two options and that none are empty.
        if (!data.options || data.options.length < 2 || data.options.some(opt => !opt || opt.trim() === '')) {
            errors.options = "Please provide at least two non-empty options.";
        }

        if (!data.correct_answer || data.correct_answer.trim() === '') {
            errors.correct_answer = "Correct answer is required.";
            // Also check if the selected answer is actually one of the options.
        } else if (data.options && !data.options.includes(data.correct_answer)) {
            errors.correct_answer = "The correct answer must be one of the provided options.";
        }

        if (!data.quiz_id) {
            errors.quiz_id = "A quiz must be selected.";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    }

    async function onSubmit(values: QuizQuestionModel) {
        if (!validateForm(values)) {
            return;
        }
        try {
            const now = new Date();
            const quizQuestionData = {
                ...values,
                createdAt: now,
                updatedAt: now
            };
            setIsSubmitting(true);
            if (quizQuestion) {
                await quizQuestionService.update(quizQuestion.id, quizQuestionData);
            } else {
                await quizQuestionService.create(quizQuestionData);
            }
            onSuccess();
            toast.success("Question saved successfully");
        } catch (error) {
            console.error("Error saving question:", error);
            toast.error("Failed to save question");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[650px]">
                <DialogHeader>
                    <DialogTitle>{quizQuestion ? "Edit Quiz Questions " : "Add New Quiz Questions"}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                        <FormField
                            control={form.control}
                            name={`quiz_id`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Quiz</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger className={formErrors.quiz_id ? "border-destructive" : ""}>
                                                <SelectValue placeholder="Select a quiz" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {quizzes?.map((quiz) => (
                                                    <SelectItem key={quiz.id} value={quiz.id || ''}>
                                                        {quiz.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="space-y-4">
                            <FormLabel>Questions</FormLabel>

                            <FormField
                                control={form.control}
                                name={`question`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input type="text" placeholder="Enter the question" {...field} value={field.value || ''} onChange={field.onChange} className={formErrors.question ? "border-destructive" : ""} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`options`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Options (comma-separated)</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g., Option 1, Option 2"
                                                {...field}
                                                onChange={(e) => field.onChange(e.target.value.split(','))}
                                                value={Array.isArray(field.value) ? field.value.join(',') : ''}
                                                className={formErrors.options ? "border-destructive" : ""}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="options"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Options</FormLabel>
                                        {field.value?.map((option, index) => (
                                            <div key={index} className="flex items-center gap-2 mb-2">
                                                <FormControl>
                                                    <Input
                                                        value={option}
                                                        onChange={(e) => {
                                                            const newOptions = [...field.value];
                                                            newOptions[index] = e.target.value;
                                                            field.onChange(newOptions);
                                                        }}
                                                        placeholder={`Option ${index + 1}`}
                                                        className={formErrors.options ? "border-destructive" : ""}
                                                    />
                                                </FormControl>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => {
                                                        const newOptions = field.value.filter((_, i) => i !== index);
                                                        field.onChange(newOptions);
                                                    }}
                                                >
                                                    <Trash className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="mt-2"
                                            onClick={() => {
                                                field.onChange([...(field.value || []), ""]);
                                            }}
                                        >
                                            Add Option
                                        </Button>
                                        {/* Display error message for the options field */}
                                        {formErrors.options && <p className="text-sm font-medium text-destructive">{formErrors.options}</p>}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* 2. The Correct Answer Field (Moved here) */}
                            <FormField
                                control={form.control}
                                name="correct_answer"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Correct Answer</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className={formErrors.correct_answer ? "border-destructive" : ""}>
                                                    <SelectValue placeholder="Select correct answer" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {/* This part correctly watches the options and lists them here */}
                                                {form.watch("options")?.filter(opt => opt && opt.trim() !== '').map((option, index) => (
                                                    <SelectItem key={index} value={option}>
                                                        {option}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name={`explanation`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Explanation</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Enter the explanation" {...field} value={field.value || ''} onChange={field.onChange} className={formErrors.explanation ? "border-destructive" : ""} />
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
                                {quizQuestion ? "Update" : "Create"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}