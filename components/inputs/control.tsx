import { createContext, forwardRef, useContext, useMemo } from "react";
import clsx from "clsx";

type InputControl = {
    children?: React.ReactNode;
    label?: any;
    error?: any;
    htmlFor?: string;
};

type InputControlContextProps = {
    isInvalid?: boolean;
};

const InputControlContext = createContext<InputControlContextProps>(
    {} as InputControlContextProps
);

export const useInputControlContext = () => useContext(InputControlContext);

const InputControl = forwardRef<HTMLDivElement, InputControl>(
    ({ children, label, htmlFor, error }, ref) => {
        const value = useMemo(
            () => ({
                isInvalid: !!error,
            }),
            [error]
        );

        const labelClassName = clsx(
            "text-lg",
            !error && "text-gray-500",
            !!error && "text-red-500"
        );

        return (
            <InputControlContext.Provider value={value}>
                <div ref={ref} className="w-full flex flex-col space-y-2">
                    <label
                        id={htmlFor}
                        htmlFor={htmlFor}
                        className={labelClassName}
                    >
                        {label}
                    </label>
                    {children}

                    {error && (
                        <span className="text-red-500 text-sm">{error}</span>
                    )}
                </div>
            </InputControlContext.Provider>
        );
    }
);

InputControl.displayName = "InputControl";

export default InputControl;
