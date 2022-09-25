import {
    BarsArrowDownIcon,
    BarsArrowUpIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { useDeletePost, useFetchPost, useFetchPosts } from "../hooks/usePost";
import { DEFAULT_PAGINATE, fetchPost } from "../services/post.service";
import Button from "./button";
import Modal from "./modal";
import Pagination from "./pagination";
import PostUpdate from "./post-update";

const PostList = () => {
    const [page, setPage] = useState(DEFAULT_PAGINATE.page);
    const [limit, setLimit] = useState(DEFAULT_PAGINATE.limit);
    const [order, setOrder] = useState<"asc" | "desc">("desc");

    const [openDetail, setOpenDetail] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [selectedId, setSelectedId] = useState<string | number>("");

    const queryClient = useQueryClient();

    const { data, isLoading, isFetching, isError, error } = useFetchPosts({
        page,
        limit,
        orderBy: "id",
        order,
    });

    const {
        data: post,
        isLoading: isLoadingPostDetail,
        isFetching: isFetchingPost,
    } = useFetchPost(selectedId);

    const { mutate: deletePostById } = useDeletePost();

    if (isError) {
        return <div>Error: {error.message}</div>;
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    const { items, count } = data || {};

    const ArrowIcon = order === "asc" ? BarsArrowDownIcon : BarsArrowUpIcon;

    return (
        <div>
            <div className="flex items-center space-x-3">
                <h2 className="text-2xl font-semibold text-gray-600">
                    Post Lists
                </h2>

                <ArrowIcon
                    role="button"
                    aria-label="Sort"
                    aria-labelledby="Sort"
                    className="h-6 w-6 text-gray-600 cursor-pointer"
                    onClick={() =>
                        setOrder((prev) => (prev === "asc" ? "desc" : "asc"))
                    }
                />
            </div>

            <div className="relative">
                <ul className="divide-y divide-gray-200">
                    {items?.map((post, index) => {
                        return (
                            <li
                                key={post.id}
                                className="py-4 flex space-x-2 items-center justify-between"
                            >
                                <div
                                    className="ml-3 cursor-pointer"
                                    onClick={() => {
                                        setOpenDetail(true);
                                        setSelectedId(post.id);
                                    }}
                                    onMouseEnter={() => {
                                        queryClient.prefetchQuery(
                                            ["posts", "detail", post.id],
                                            () => fetchPost(post.id),
                                            {
                                                staleTime: 1000 * 60 * 60,
                                            }
                                        );
                                    }}
                                >
                                    <p className="text-sm font-medium text-gray-900">
                                        <span className="mr-2">
                                            {post.id}.{" "}
                                        </span>
                                        <span>{post.title}</span>
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {post.body}
                                    </p>
                                </div>
                                <div>
                                    <Button
                                        size="sm"
                                        onClick={() => deletePostById(post.id)}
                                        variant="btn-danger"
                                    >
                                        Remove
                                    </Button>
                                </div>
                            </li>
                        );
                    })}
                </ul>

                {isFetching && <p>Updating data..</p>}
            </div>

            <div className="mt-10">
                <Pagination
                    page={page}
                    perPage={limit}
                    onChangePerPage={setLimit}
                    onChange={(page) => setPage(page)}
                    count={count}
                    itemsLength={items?.length}
                />
            </div>

            <Modal
                open={openDetail}
                onClose={() => setOpenDetail(false)}
                title={
                    isLoadingPostDetail || isFetchingPost
                        ? "Fetching..."
                        : post?.title
                }
                subtitle={
                    isLoadingPostDetail || isFetchingPost
                        ? "Fetching content..."
                        : post?.body
                }
                footer={
                    <>
                        <Button
                            size="sm"
                            onClick={() => {
                                setOpenEdit(true);
                                setOpenDetail(false);
                            }}
                        >
                            Edit
                        </Button>
                        <Button
                            variant="btn-secondary"
                            size="sm"
                            onClick={() => setOpenDetail(false)}
                        >
                            Cancel
                        </Button>
                    </>
                }
            />

            <Modal
                open={openEdit}
                onClose={() => {
                    setOpenEdit(false);
                    setOpenDetail(true);
                }}
            >
                <PostUpdate
                    defaultValues={post}
                    onCancel={() => {
                        setOpenEdit(false);
                        setOpenDetail(true);
                    }}
                />
            </Modal>
        </div>
    );
};

export default PostList;
