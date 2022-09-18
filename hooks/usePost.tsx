import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
    fetchPosts,
    createPost,
    deletePost,
    fetchPost,
    updatePost,
} from "../services/post.service";
import useUndoablePromise from "./useUndoablePromise";

export const useFetchPosts = (params?: Partial<RequestGetParams>) => {
    return useQuery<ListResponse<PostType>, Error>(
        ["posts", "list", params],
        () => fetchPosts(params),
        {
            retry: 1,
            keepPreviousData: true,
            staleTime: 1000 * 60 * 5,
        }
    );
};

export const useFetchPost = (
    id?: string | number,
    params?: Partial<RequestGetParams>
) => {
    return useQuery<PostType, Error>(
        ["posts", "detail", id, params],
        () => fetchPost(id, params),
        {
            retry: 1,
            keepPreviousData: true,
            staleTime: 1000 * 60 * 5,
            enabled: !!id,
        }
    );
};

export const useCreatePost = () => {
    const queryClient = useQueryClient();

    const prepareMutation = useUndoablePromise({
        mutationFn: createPost,
        rejectMessage: "Post creation cancelled",
        submittingText: "Creating post...",
        undoLabelButton: "Undo create",
        timeout: 3000,
    });

    return useMutation(prepareMutation, {
        onMutate: (post) => {
            queryClient.cancelQueries(["posts", "list"]);

            const previousPosts = queryClient.getQueryData<
                ListResponse<PostType>
            >(["posts", "list"]);

            queryClient.setQueriesData<ListResponse<PostType>>(
                ["posts", "list"],
                (old) => {
                    if (old) {
                        const newData = [
                            ...old.items,
                            {
                                ...post,
                                id: old.items.length + 1,
                            },
                        ].reverse();
                        return {
                            ...old,
                            items: newData,
                        };
                    }
                }
            );

            return previousPosts;
        },
        onError: (error: Error, variables, previousPosts) => {
            queryClient.setQueriesData(["posts", "list"], previousPosts);
        },
        onSuccess: () => {
            toast.success("Post created successfully");
        },
        onSettled: () => {
            queryClient.invalidateQueries(["posts", "list"]);
        },
    });
};

export const useUpdatePost = () => {
    const queryClient = useQueryClient();

    const prepareMutation = useUndoablePromise({
        mutationFn: updatePost,
        rejectMessage: "Post modification cancelled",
        submittingText: "Updating post...",
        undoLabelButton: "Undo update",
        timeout: 3000,
    });

    return useMutation(prepareMutation, {
        onMutate: (post) => {
            queryClient.cancelQueries(["posts", "list"]);

            const previousPosts = queryClient.getQueryData<
                ListResponse<PostType>
            >(["posts", "list"]);

            const previousPost = queryClient.getQueryData<PostType>([
                "posts",
                "detail",
                post.id,
            ]);

            queryClient.setQueriesData<PostType>(
                ["posts", "detail", post.id],
                post
            );

            return {
                previousPost,
                previousPosts,
            };
        },
        onError: (error: Error, _, context) => {
            queryClient.setQueriesData(
                ["posts", "detail", context?.previousPost?.id],
                context?.previousPost
            );
        },
        onSuccess: (_, variables) => {
            toast.success("Post updated successfully");
            queryClient.invalidateQueries(["posts", "detail", variables.id]);
        },
        onSettled: () => {
            queryClient.invalidateQueries(["posts", "list"]);
        },
    });
};

export const useDeletePost = () => {
    const queryClient = useQueryClient();

    const prepareMutation = useUndoablePromise({
        mutationFn: deletePost,
        submittingText: "Deleting...",
        undoLabelButton: "Undo delete",
        timeout: 3000,
    });

    return useMutation(prepareMutation, {
        onMutate: (id) => {
            queryClient.cancelQueries(["posts", "list"]);

            const previousPosts = queryClient.getQueryData<
                ListResponse<PostType>
            >(["posts", "list"]);

            queryClient.setQueriesData<ListResponse<PostType>>(
                ["posts", "list"],
                (old) => {
                    if (old) {
                        const newData = old.items.filter(
                            (item) => item.id !== id
                        );
                        return {
                            ...old,
                            items: newData,
                        };
                    }
                }
            );

            return previousPosts;
        },
        onError: (error: Error, variables, previousPosts) => {
            queryClient.setQueriesData(["posts", "list"], previousPosts);
        },
        onSuccess: () => {
            toast.success("Post deleted successfully");
        },
        onSettled: () => {
            queryClient.invalidateQueries(["posts", "list"]);
        },
    });
};
