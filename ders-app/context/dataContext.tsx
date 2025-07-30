"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { dersService } from '@/lib/services/ders';
import { ustadhService } from '@/lib/services/ustadh';
import { categoryService } from '@/lib/services/category';
import { DersModel } from '@/model/Ders';
import { UstadhModel } from '@/model/Ustadh';
import { CategoryModel } from '@/model/Category';
import { UserModel } from '@/model/user';
import { userService } from '@/lib/services/user';

type DataContextType = {
    derses: DersModel[];
    ustadhs: UstadhModel[];
    categories: CategoryModel[];
    users: UserModel[];
    loading: boolean;
    error: string | null;
    refreshData: () => Promise<void>;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
    const [users, setUsers] = useState<UserModel[]>([]);
    const [derses, setDerses] = useState<DersModel[]>([]);
    const [ustadhs, setUstadhs] = useState<UstadhModel[]>([]);
    const [categories, setCategories] = useState<CategoryModel[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch all data in parallel
            const [dersesData, ustadhsData, categoriesData, usersData] = await Promise.all([
                dersService.getAll(),
                ustadhService.getAll(),
                categoryService.getAll(),
                userService.getAll(),
            ]);

            setDerses(dersesData);
            setUstadhs(ustadhsData);
            setCategories(categoriesData);
            setUsers(usersData);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Failed to fetch data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    return (
        <DataContext.Provider
            value={{
                derses,
                ustadhs,
                categories,
                users,
                loading,
                error,
                refreshData: fetchAllData,
            }}
        >
            {children}
        </DataContext.Provider>
    );
}

export const useData = (): DataContextType => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};

// Export a hook that can be used to directly access the context
export default DataContext;