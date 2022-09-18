import React from "react";
import { useForm } from "react-hook-form";
import { useCreatePost } from "../hooks/usePost";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

import Button from "./button";
import InputControl from "./inputs/control";

import InputText from "./inputs/text";
import InputTextArea from "./inputs/textarea";

export default function PostCreate() {
    const { register, formState, reset, handleSubmit } =
        useForm<CreatePostType>({
            defaultValues: {
                createdAt: new Date().toISOString(),
            },
            mode: "onChange",
            reValidateMode: "onChange",
        });

    const { mutateAsync } = useCreatePost();

    const createPost = async (data: CreatePostType) => {
        await mutateAsync(data, {
            onSuccess: () => {
                reset();
            },
        });
    };

    return (
        <div className="flex flex-col space-y-5">
            <h2 className="flex items-center text-2xl font-semibold text-gray-600">
                Create Post
                <span className="ml-2">
                    <PlusCircleIcon className="h-6 w-6" />
                </span>
            </h2>
            <form
                className="flex flex-col space-y-5"
                onSubmit={handleSubmit(createPost)}
            >
                <div className="flex flex-col space-y-2">
                    <InputControl
                        label="Title"
                        htmlFor="title"
                        error={formState.errors?.title?.message}
                    >
                        <InputText
                            type="text"
                            placeholder="Type title, ex: My first post"
                            {...register("title", {
                                required: {
                                    value: true,
                                    message: "Title is required",
                                },
                                disabled: formState.isSubmitting,
                            })}
                        />
                    </InputControl>
                </div>

                <div className="flex flex-col space-y-2">
                    <InputControl
                        label="Content"
                        htmlFor="body"
                        error={formState.errors?.body?.message}
                    >
                        <InputTextArea
                            placeholder="Type body, ex: Hello world"
                            {...register("body", {
                                required: {
                                    value: true,
                                    message: "Body is required",
                                },
                                disabled: formState.isSubmitting,
                            })}
                        />
                    </InputControl>
                </div>

                <div className="flex flex-col space-y-2">
                    <InputControl
                        label="User ID"
                        htmlFor="userId"
                        error={formState.errors?.userId?.message}
                    >
                        <InputText
                            placeholder="Type user id, ex: 2"
                            {...register("userId", {
                                required: {
                                    value: true,
                                    message: "User ID is required",
                                },
                                disabled: formState.isSubmitting,
                            })}
                        />
                    </InputControl>
                </div>
                <div className="mt-20 space-x-2">
                    <Button isDisabled={formState.isSubmitting} type="submit">
                        {formState.isSubmitting ? "Submitting..." : "Submit"}
                    </Button>
                    <Button
                        isDisabled={formState.isSubmitting}
                        onClick={() => reset()}
                        variant="btn-danger"
                    >
                        Reset
                    </Button>
                </div>
            </form>
        </div>
    );
}
