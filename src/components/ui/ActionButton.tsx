import { Button } from "react-aria-components";
import type React from "react";

type ActionButtonProps = {
  onClick: () => void;
  disabled: boolean;
  icon: React.ElementType;
  label: string;
};

export function ActionButton({
  onClick,
  disabled,
  icon: Icon,
  label,
}: ActionButtonProps) {
  return (
    <Button
      onPress={onClick}
      isDisabled={disabled}
      className="action-button"
    >
      <Icon size={16} />
      {label}
    </Button>
  );
}