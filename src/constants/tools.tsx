import { Circle, Eraser, Minus, Paintbrush, Square } from "lucide-react";
import type { ToolButtonItem } from "../types/drawing";

export const toolButtons: ToolButtonItem[] = [
  { id: "pen", label: "Pen", description: "Freehand sketching", icon: Paintbrush },
  { id: "eraser", label: "Eraser", description: "Remove marks", icon: Eraser },
  { id: "line", label: "Line", description: "Straight strokes", icon: Minus },
  { id: "rectangle", label: "Box", description: "Outlined shapes", icon: Square },
  { id: "circle", label: "Circle", description: "Radial shapes", icon: Circle },
];

export const STORAGE_KEY = "sketchpad-drawing";