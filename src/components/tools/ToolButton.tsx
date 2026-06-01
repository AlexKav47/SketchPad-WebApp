import type { ToolButtonItem } from "../../types/drawing";

type ToolButtonProps = {
  item: ToolButtonItem;
  selected: boolean;
  onClick: () => void;
};

export function ToolButton({ item, selected, onClick }: ToolButtonProps) {
  const Icon = item.icon;

  return (
    <button
      onClick={onClick}
      type="button"
      className={`tool-button ${selected ? "selected" : ""}`}
    >
      <span className={`tool-icon ${selected ? "selected-icon" : ""}`}>
        <Icon size={17} />
      </span>

      <span className="tool-meta">
        <span className="tool-title">{item.label}</span>
        <span className="tool-description">{item.description}</span>
      </span>
    </button>
  );
}