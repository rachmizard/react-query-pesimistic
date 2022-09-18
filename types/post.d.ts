declare type PostType = {
    userId: number;
    id: number;
    title: string;
    body: string;
    createdAt: string | Date;
};

declare type CreatePostType = PostType;
declare type UpdatePostType = PostType;
