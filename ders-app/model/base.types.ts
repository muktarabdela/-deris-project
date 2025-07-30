/**
 * Base types and interfaces used across all models
 */

export type BaseModel = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
};

export type PaginationParams = {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
};

export type PaginatedResult<T> = {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};

export type QueryOptions = {
    include?: Record<string, boolean>;
    where?: Record<string, any>;
    orderBy?: Record<string, 'asc' | 'desc'>;
    take?: number;
    skip?: number;
};

export type CreateInput<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateInput<T> = Partial<CreateInput<T>>;
