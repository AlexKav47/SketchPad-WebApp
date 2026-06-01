import type { Tool } from "../../types/drawing";
import { toolButtons } from "../../constants/tools";
import { ToolButton } from "../tools/ToolButton";

type SidebarProps = {
  tool: Tool;
  setTool: (tool: Tool) => void;
};

export function Sidebar({ tool, setTool }: SidebarProps) {
  return (
    <aside className="tool-sidebar">
      <div className="tool-sidebar-inner">
        {toolButtons.map((item) => (
          <ToolButton
            key={item.id}
            item={item}
            selected={tool === item.id}
            onClick={() => setTool(item.id)}
          />
        ))}
      </div>
    </aside>
  );
}
