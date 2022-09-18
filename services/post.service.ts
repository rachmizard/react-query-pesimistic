import axios from "axios";

axios.defaults.baseURL = "https://632601814cd1a2834c48c718.mockapi.io";

export const DEFAULT_PAGINATE = {
    page: 1,
    limit: 10,
};

export const fetchPosts = async (
    params: Partial<RequestGetParams> = {
        page: DEFAULT_PAGINATE.page,
        limit: DEFAULT_PAGINATE.limit,
    }
) => {
    try {
        const { data } = await axios.get<ListResponse<PostType>>("/posts", {
            params,
        });

        return data;
    } catch (error) {
        throw error;
    }
};

export const fetchPost = async (
    id?: string | number,
    params: Partial<RequestGetParams> = {
        page: DEFAULT_PAGINATE.page,
        limit: DEFAULT_PAGINATE.limit,
    }
) => {
    try {
        const { data } = await axios.get<PostType>(`/posts/${id}`, {
            params,
        });

        return data;
    } catch (error) {
        throw error;
    }
};

export const createPost = async (post: CreatePostType) => {
    try {
        const { data } = await axios.post("/posts", post);

        return data;
    } catch (error) {
        throw error;
    }
};

export const updatePost = async (post: UpdatePostType) => {
    try {
        const { data } = await axios.put(`/posts/${post.id}`, post);

        return data;
    } catch (error) {
        throw error;
    }
};

export const deletePost = async (id: number | string) => {
    try {
        const { data } = await axios.delete(`/posts/${id}`);

        return data;
    } catch (error) {
        throw error;
    }
};
