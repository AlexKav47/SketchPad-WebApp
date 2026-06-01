import { Download, RotateCcw, Palette, ArrowRightLeft, Trash2 } from "lucide-react";
import type { CanvasBackground, Tool } from "../../types/drawing";
import { toolButtons } from "../../constants/tools";

type AppHeaderProps = {
  onExport: () => void;
  onClear: () => void;
  colour: string;
  setColour: (colour: string) => void;
  brushSize: number;
  setBrushSize: (size: number) => void;
  canvasBackground: CanvasBackground;
  setCanvasBackground: (background: CanvasBackground) => void;
  tool: Tool;
  setTool: (tool: Tool) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
};

export function AppHeader({
  onExport,
  onClear,
  colour,
  setColour,
  brushSize,
  setBrushSize,
  canvasBackground,
  setCanvasBackground,
  tool,
  setTool,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: AppHeaderProps) {
  return (
    <header className="topbar">
      <div className="topbar-main-row">
        <div className="topbar-brand">
          <div className="brand-icon">
            <Palette size={26} />
          </div>
          <span className="brand-title">SketchPad</span>
        </div>

        <div className="topbar-tools">
          {toolButtons.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                className={`tool-pill ${tool === item.id ? "selected" : ""}`}
                onClick={() => setTool(item.id)}
              >
                <Icon size={14} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="topbar-right-group">
          <div className="topbar-controls">
            <div className="topbar-control-group">
              <span className="control-label">Color</span>
              <input
                type="color"
                value={colour}
                onChange={(e) => setColour(e.target.value)}
                className="color-picker"
              />
            </div>

            <div className="topbar-control-group range-group">
              <span className="control-label">Brush Size</span>
              <input
                type="range"
                min="1"
                max="40"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="range-slider"
              />
            </div>

            <div className="topbar-control-group select-group">
              <span className="control-label">Canvas Type</span>
              <select
                value={canvasBackground}
                onChange={(e) => setCanvasBackground(e.target.value as CanvasBackground)}
                className="select-field"
              >
                <option value="plain">Plain</option>
                <option value="dots">Dots</option>
                <option value="grid">Grid</option>
              </select>
            </div>
          </div>

          <div className="topbar-action-buttons">
            <button type="button" className="icon-button" onClick={onUndo} disabled={!canUndo}>
              <ArrowRightLeft size={16} />
            </button>
            <button type="button" className="icon-button" onClick={onRedo} disabled={!canRedo}>
              <RotateCcw size={16} />
            </button>
            <button type="button" className="icon-button" onClick={onClear}>
              <Trash2 size={16} />
            </button>
            <button type="button" className="icon-button" onClick={onExport}>
              <Download size={14} />
              Export
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
