export interface InventoryModule
{
    _id?: string;
    title?: string;
    description?: string;
    sql?: string;
    result: {
        good: string;
        worst: string;
    };
    database?: {
        type: string;
        version: string;
    };
    category?: string;
    enabled?: boolean;
    readMore?: string;
}

export interface InventoryPagination
{
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}
