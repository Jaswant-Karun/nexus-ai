import type { ReactNode } from "react";

type PrimaryButtonProps = {
  children: ReactNode;
  variant?: "solid" | "ghost";
};

export function PrimaryButton({ children, variant = "solid" }: PrimaryButtonProps) {
  return (
    <button className={`primary-button primary-button--${variant}`} type="button">
      {children}
    </button>
  );
}
