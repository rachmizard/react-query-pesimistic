import { useState } from "react";
import type { AppProps } from "next/app";
import {
    DehydratedState,
    Hydrate,
    MutationCache,
    QueryCache,
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "tailwindcss/tailwind.css";

import toast, { Toaster } from "react-hot-toast";

import "../styles/globals.css";

function MyApp({
    Component,
    pageProps,
}: AppProps<{ dehydratedState: DehydratedState }>) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        retry: 1,
                        keepPreviousData: true,
                        staleTime: 1000 * 60 * 5,
                    },
                },
                queryCache: new QueryCache({
                    onError: (error: any, query) => {
                        toast.error(error.message);
                    },
                }),
                mutationCache: new MutationCache({
                    onError: (error: any, query) => {
                        toast.error(error.message);
                    },
                }),
            })
    );

    return (
        <>
            <Toaster />
            <QueryClientProvider client={queryClient}>
                <Hydrate state={pageProps.dehydratedState}>
                    <Component {...pageProps} />
                </Hydrate>
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </>
    );
}

export default MyApp;
