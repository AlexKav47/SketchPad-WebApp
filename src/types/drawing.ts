import type React from "react";

export type Tool = "pen" | "eraser" | "line" | "rectangle" | "circle";

export type CanvasBackground = "plain" | "dots" | "grid";

export type Point = {
  x: number;
  y: number;
};

export type ToolButtonItem = {
  id: Tool;
  label: string;
  description: string;
  icon: React.ElementType;
};