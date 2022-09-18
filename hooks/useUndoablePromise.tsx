import { useCallback, useRef } from "react";
import toast from "react-hot-toast";
import Button from "../components/button";

type UseUndoablePromise<TData, TVariables> = {
    submittingText?: string;
    undoLabelButton?: string;
    rejectMessage?: string;
    mutationFn: (variables: TVariables) => Promise<TData>;
    timeout?: number;
};

export default function useUndoablePromise<TData, TVariables>(
    props: UseUndoablePromise<TData, TVariables>
) {
    const {
        mutationFn,
        undoLabelButton = "Undo",
        rejectMessage = "Request cancelled",
        submittingText = "Submitting...",
        timeout = 6000,
    } = props || {};

    const cancelRef = useRef<() => void>();

    const mutation = useCallback(
        (variables: TVariables): Promise<TData> => {
            toast(
                (t) => (
                    <div className="flex items-center space-x-10">
                        <span>{submittingText}</span>
                        <Button
                            onClick={() => {
                                cancelRef.current && cancelRef.current();
                                toast.dismiss(t.id);
                            }}
                        >
                            {undoLabelButton}
                        </Button>
                    </div>
                ),
                {
                    duration: timeout,
                }
            );

            return new Promise((resolve, reject) => {
                const mutationTimeout = setTimeout(async () => {
                    try {
                        const data =
                            mutationFn && (await mutationFn(variables));
                        resolve(data);
                    } catch (error) {
                        reject(error);
                    }
                }, timeout);

                const cancelMutation = () => {
                    clearTimeout(mutationTimeout);
                    reject({
                        message: rejectMessage,
                    });
                };

                cancelRef.current = cancelMutation;
            });
        },
        [mutationFn, rejectMessage, submittingText, timeout, undoLabelButton]
    );

    return mutation;
}
