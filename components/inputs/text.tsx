import React, { forwardRef, InputHTMLAttributes } from "react";
import clsx from "clsx";

import { useInputControlContext } from "./control";

type InputTextProps = InputHTMLAttributes<HTMLInputElement>;

const InputText = forwardRef<HTMLInputElement, InputTextProps>((props, ref) => {
    const { isInvalid } = useInputControlContext();

    const baseClassName =
        "px-4 py-2 ring-[1.5px] ring-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 disabled:ring-0 transition-all duration-200";

    const inputClassName = clsx(baseClassName, !!isInvalid && "ring-red-400");

    return (
        <input {...props} ref={ref} type="text" className={inputClassName} />
    );
});

InputText.displayName = "InputText";

export default InputText;
