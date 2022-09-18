declare type ListResponse<T> = {
    requestId: number;
    items: T[];
    count: number;
};
