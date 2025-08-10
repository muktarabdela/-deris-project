"use client"
import { useData } from "@/context/dataContext";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { BookOpen, Edit, Loader2, MoreVertical, Plus, Search, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { AdminModel } from "@/model/admins";
import { adminService } from "@/lib/services/admins";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminFormDialog } from "@/components/admin/admin-form-dialog";
import { Badge } from "@/components/ui/badge";
import AdminChangePasswordFormDialog from "@/components/admin/admin-change-password-form-dialog";

export default function Admins() {
    const { admins, refreshData, loading } = useData()
    const [searchTerm, setSearchTerm] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingAdmin, setEditingAdmin] = useState<AdminModel | null>(null)
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const [changePasswordAdmin, setChangePasswordAdmin] = useState<AdminModel | null>(null)
    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
    const stats = [
        { title: 'Total Admins', value: admins.length.toString(), icon: Users },
    ]

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this admin?')) return;

        try {
            setIsDeleting(id);
            await adminService.delete(id);
            refreshData();
            toast.success('Admin deleted successfully');
        } catch (error) {
            console.error('Error deleting admin:', error);
            toast.error('Failed to delete admin');
        } finally {
            setIsDeleting(null);
        }
    };

    const handleEdit = (admin: AdminModel) => {
        setEditingAdmin(admin);
        setIsDialogOpen(true);
    };
    const handlePasswordChange = (admin: AdminModel) => {
        setChangePasswordAdmin(admin);
        setIsPasswordDialogOpen(true);
    };
    const handleAddAdmin = () => {
        setEditingAdmin(null);
        setIsDialogOpen(true);
    };
    const handleSuccess = async () => {
        try {
            refreshData();
            setIsDialogOpen(false);
            setEditingAdmin(null);
        } catch (error) {
            console.error('Error refreshing admins:', error);
            toast.error('Failed to refresh admins list');
        } finally {
        }
    };
    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }
    const filteredAdmins = admins?.filter((admin) =>
        admin.first_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">

                <div>
                    <h1 className="text-3xl font-bold">Admins</h1>
                    <p className="text-muted-foreground">Manage Admins</p>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search admins..."
                            className="pl-8 sm:w-[300px]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button onClick={handleAddAdmin}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Admin
                    </Button>
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>is_active</TableHead>
                            <TableHead>Total Ders</TableHead>
                            <TableHead>Total Audio Parts</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredAdmins?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    {searchTerm ? 'No matching admins found' : 'No admins found'}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredAdmins?.map((admin) => (
                                <TableRow key={admin.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center space-x-3">
                                            <span>{admin.first_name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-[200px] truncate">
                                        <Badge variant={admin.is_active ? 'default' : 'secondary'}>
                                            {admin.is_active ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center text-sm">
                                            <BookOpen className="mr-1 h-4 w-4 text-muted-foreground" />
                                            {admin.total_ders || 0} ders
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {admin.total_audio_parts || 0} audio parts
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
                                                <DropdownMenuItem onClick={() => handleEdit(admin)}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handlePasswordChange(admin)}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Change Password
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-destructive"
                                                    onClick={() => handleDelete(admin.id)}
                                                    disabled={isDeleting === admin.id}
                                                >
                                                    {isDeleting === admin.id ? (
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
                    Showing <strong>1-{admins.length}</strong> of <strong>{admins.length}</strong> admins
                </div>
            </div>
            <AdminFormDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                admin={editingAdmin}
                onSuccess={handleSuccess}
            />
            <AdminChangePasswordFormDialog
                open={isPasswordDialogOpen}
                onOpenChange={setIsPasswordDialogOpen}
                admin={changePasswordAdmin}
            />
        </div>
    );
}