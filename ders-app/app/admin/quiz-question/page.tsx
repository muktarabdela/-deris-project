"use client";

import { useData } from "@/context/dataContext";
import { AudioPartModel } from "@/model/AudioPart";
import { useState } from "react";
import { toast } from "sonner";
import { Search, Plus, MoreVertical, Loader2, Edit, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QuizModel } from "@/model/Quiz";
import { QuizQuestionModel } from "@/model/QuizQuestion";
import { quizService } from "@/lib/services/quiz";
import { QuizFormDialog } from "@/components/admin/quiz-form-dialog";
import { QuizQuestionFormDialog } from "@/components/admin/quiz-quesion-form-dialog";

export default function QuizzesPage() {
    const { quizzes, quizQuestions, audioParts, loading, refreshData } = useData();
    const [searchQuery, setSearchQuery] = useState('');
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [expandedQuiz, setExpandedQuiz] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<QuizQuestionModel | null>(null);



    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this quiz and all its questions?')) return;

        try {
            setIsDeleting(id);
            await quizService.delete(id);
            refreshData();
            toast.success('Quiz deleted successfully');
        } catch (error) {
            console.error('Error deleting quiz:', error);
            toast.error('Failed to delete quiz');
        } finally {
            setIsDeleting(null);
        }
    };

    const handleAddQuestion = () => {
        setEditingQuestion(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (question: QuizQuestionModel) => {
        setEditingQuestion(question);
        setIsDialogOpen(true);
    };

    const handleSuccess = async () => {
        try {
            setIsLoading(true);
            refreshData();
            setIsDialogOpen(false);
            setEditingQuestion(null);
        } catch (error) {
            console.error('Error refreshing quizzes:', error);
            toast.error('Failed to refresh quizzes list');
        } finally {
            setIsLoading(false);
        }
    };

    const getQuizQuestions = (quizId: string): QuizQuestionModel[] => {
        return quizQuestions?.filter(q => q.quiz_id === quizId) || [];
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const filteredQuestions = quizQuestions?.filter(question => {
        return question.question.toLowerCase().includes(searchQuery.toLowerCase())
    });

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Quiz Questions</h1>
                <div className="flex items-center space-x-2">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search quiz questions by audio part..."
                            className="pl-8 w-[300px]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button onClick={handleAddQuestion}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Question
                    </Button>
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Quiz</TableHead>
                            <TableHead>Question</TableHead>
                            <TableHead>Options</TableHead>
                            <TableHead>Correct Answer</TableHead>
                            <TableHead>Explanation</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredQuestions?.map((question) => (
                            <TableRow key={question.id}>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span>{quizzes?.find(q => q.id === question.quiz_id)?.name || 'unassigned'}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium">
                                    <div className="flex flex-col">
                                        <span>{question.question}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span>{question.options.join(', ')}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span>{question.correct_answer}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span>{question.explanation}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEdit(question)
                                                }}
                                            >
                                                <Edit className="mr-2 h-4 w-4" />
                                                <span>Edit</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="text-destructive"
                                                onClick={async (e) => {
                                                    e.stopPropagation();
                                                    await handleDelete(question.id);
                                                }}
                                                disabled={isDeleting === question.id}
                                            >
                                                {isDeleting === question.id ? (
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                )}
                                                <span>Delete</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        )
                        )}
                        {filteredQuestions?.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No questions found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <QuizQuestionFormDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                quizQuestion={editingQuestion}
                onSuccess={handleSuccess}
            />
        </div >
    );
}