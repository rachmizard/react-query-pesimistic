import React, { ButtonHTMLAttributes, forwardRef } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    isDisabled?: boolean;
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
    const { children, isDisabled, disabled, ...rest } = props;
    const baseClassName =
        "min-w-[100px] bg-blue-400 text-white rounded-md px-4 py-2 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 disabled:ring-0 hover:bg-blue-500 transition-all duration-400 shadow-md";

    const buttonClassName = baseClassName;

    return (
        <button
            className={buttonClassName}
            ref={ref}
            disabled={isDisabled || disabled}
            {...rest}
        >
            {children}
        </button>
    );
});

Button.displayName = "Button";

export default Button;
