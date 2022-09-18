import React, { ButtonHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    isDisabled?: boolean;
    variant?: "btn-primary" | "btn-secondary" | "btn-danger";
    size?: "sm" | "md" | "lg";
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
    const { children, isDisabled, disabled, size, variant, ...rest } = props;

    const baseClassName = `btn-base`;

    const sizeClassName = clsx(
        size === "lg" && "btn-lg",
        size === "md" && "btn-md",
        size === "sm" && "btn-sm"
    );

    return (
        <button
            className={`${baseClassName} ${sizeClassName} ${variant}`}
            ref={ref}
            disabled={isDisabled || disabled}
            {...rest}
        >
            {children}
        </button>
    );
});

Button.displayName = "Button";

Button.defaultProps = {
    size: "md",
    variant: "btn-primary",
};

export default Button;
