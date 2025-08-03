"use client";

import { useData } from "@/context/dataContext";
import { audioPartService } from "@/lib/services/audio-part";
import { AudioPartModel } from "@/model/AudioPart";
import { useState } from "react";
import { toast } from "sonner";
import { AudioPartFormDialog } from "@/components/admin/audio-part-form-dialog";
import { Search, Plus, MoreVertical, User, BookOpen, Loader2, Edit, Trash2 } from 'lucide-react';
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
import { QuizQuestionModel } from "@/model/QuizQuestion";
export default function AudioPartsPage() {
    const { audioParts, loading, error, refreshData, derses, quizzes, quizQuestions } = useData();
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingAudioPart, setEditingAudioPart] = useState<AudioPartModel | null>(null);

    const [isAddQuizOpen, setIsAddQuizOpen] = useState(false)

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this audio part?')) return;

        try {
            setIsDeleting(id);
            await audioPartService.delete(id);
            refreshData();
            toast.success('Audio part deleted successfully');
        } catch (error) {
            console.error('Error deleting audio part:', error);
            toast.error('Failed to delete audio part');
        } finally {
            setIsDeleting(null);
        }
    };

    const handleEdit = (audioPart: AudioPartModel) => {
        setEditingAudioPart(audioPart);
        setIsDialogOpen(true);
    };

    const handleAddQuizToAudio = () => {
        setIsAddQuizOpen(true)
    }

    const handleAddAudioPart = () => {
        setEditingAudioPart(null);
        setIsDialogOpen(true);
    };

    const handleSuccess = async () => {
        try {
            setIsLoading(true);
            refreshData();
            setIsDialogOpen(false);
            setEditingAudioPart(null);
        } catch (error) {
            console.error('Error refreshing audio parts:', error);
            toast.error('Failed to refresh audio parts list');
        } finally {
            setIsLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const filteredAudioParts = audioParts?.filter((audioPart) =>
        audioPart.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const getQuizQuestions = (quizId: string): QuizQuestionModel[] => {
        return quizQuestions?.filter(q => q.quiz_id === quizId) || [];
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
                <div>
                    <h1 className="text-3xl font-bold">Audio Parts</h1>
                    <p className="text-muted-foreground">Manage audio parts</p>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search audio parts..."
                            className="pl-8 sm:w-[300px]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button onClick={handleAddAudioPart}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Audio Part
                    </Button>
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>duration in seconds</TableHead>
                            <TableHead>order</TableHead>
                            <TableHead>ders name</TableHead>
                            <TableHead>total quiz Questions</TableHead>

                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredAudioParts?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                    {searchQuery ? 'No matching audio parts found' : 'No audio parts found'}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredAudioParts?.map((audioPart) => (
                                <TableRow key={audioPart.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center space-x-3">
                                            {audioPart.title}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={audioPart.is_published ? 'default' : 'secondary'}>
                                            {audioPart.is_published ? 'Published' : 'Draft'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {audioPart.duration_in_seconds}
                                    </TableCell>
                                    <TableCell>
                                        {audioPart.order}
                                    </TableCell>
                                    <TableCell>
                                        {derses?.find((ders) => ders.id === audioPart.ders_id)?.title}
                                    </TableCell>
                                    <TableCell>
                                        {getQuizQuestions(audioPart.id).length || 0}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreVertical className="h-4 w-4" />
                                                    <span className="sr-only">Open menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleEdit(audioPart)}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={handleAddQuizToAudio}>

                                                    Add Quiz
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-destructive"
                                                    onClick={() => handleDelete(audioPart.id)}
                                                    disabled={isDeleting === audioPart.id}
                                                >
                                                    {isDeleting === audioPart.id ? (
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                    )}
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between px-2">
                <div className="text-sm text-muted-foreground">
                    Showing <strong>1-{audioParts.length}</strong> of <strong>{audioParts.length}</strong> audio parts
                </div>
            </div>
            <AudioPartFormDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                audioPart={editingAudioPart}
                onSuccess={handleSuccess}
            />
        </div>
    );
}