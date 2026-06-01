import type React from "react";

type ControlGroupProps = {
  label: string;
  value?: string;
  children: React.ReactNode;
};

export function ControlGroup({ label, value, children }: ControlGroupProps) {
  return (
    <div className="control-group">
      <div className="control-group-label">
        <label>{label}</label>
        {value && <span>{value}</span>}
      </div>
      {children}
    </div>
  );
}