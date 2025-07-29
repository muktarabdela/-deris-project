import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, MoreVertical, User, Mail, Award } from 'lucide-react';
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

type User = {
    id: string;
    name: string;
    email: string;
    role: 'STUDENT' | 'ADMIN';
    joinDate: string;
};

// Mock data - replace with actual data fetching
const users: User[] = [
    {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'ADMIN',
        joinDate: '2023-01-15',
    },
    {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'STUDENT',
        joinDate: '2023-02-20',
    },
    // Add more mock users as needed
];

export default function UsersPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
                <div>
                    <h1 className="text-3xl font-bold">Users</h1>
                    <p className="text-muted-foreground">Manage users and their permissions</p>
                </div>
                <div className="flex items-center space-x-2
        ">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search users..."
                            className="pl-8 sm:w-[300px]"
                        />
                    </div>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add User
                    </Button>
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center space-x-2">
                                        <User className="h-5 w-5 text-muted-foreground" />
                                        <span>{user.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${user.role === 'ADMIN'
                                            ? 'bg-primary/10 text-primary'
                                            : 'bg-secondary/10 text-secondary-foreground'
                                        }`}>
                                        {user.role}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    {new Date(user.joinDate).toLocaleDateString()}
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
                                            <DropdownMenuItem>View Profile</DropdownMenuItem>
                                            <DropdownMenuItem>Edit</DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive">
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between px-2">
                <div className="text-sm text-muted-foreground">
                    Showing <strong>1-{users.length}</strong> of <strong>{users.length}</strong> users
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" disabled>
                        Previous
                    </Button>
                    <Button variant="outline" size="sm" disabled>
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}
