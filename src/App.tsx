import { useEffect, useRef, useState } from "react";
import "./App.css";
import { AppHeader } from "./components/layout/AppHeader";
import { CanvasWorkspace } from "./components/canvas/CanvasWorkspace";
import { STORAGE_KEY } from "./constants/tools";
import type { CanvasBackground, Point, Tool } from "./types/drawing";
import { drawCanvasBackground } from "./utils/canvasBackground";

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const startPointRef = useRef<Point | null>(null);
  const canvasSnapshotRef = useRef<ImageData | null>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<Tool>("pen");
  const [colour, setColour] = useState("#111827");
  const [brushSize, setBrushSize] = useState(6);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [canvasBackground, setCanvasBackground] =
    useState<CanvasBackground>("plain");

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvasContainerRef.current;
    if (!canvas || !container) return;

    const resizeCanvas = () => {
      const savedDrawing = localStorage.getItem(STORAGE_KEY);
      const frameStyle = getComputedStyle(container);
      const horizontalPadding =
        parseFloat(frameStyle.paddingLeft) + parseFloat(frameStyle.paddingRight);
      const availableWidth = Math.max(container.clientWidth - horizontalPadding, 0);
      const canvasWidth = Math.round(availableWidth);
      const canvasHeight = Math.round(canvasWidth * 0.62);
      const scale = Math.max(1, window.devicePixelRatio || 1);

      canvas.style.width = `${canvasWidth}px`;
      canvas.style.height = `${canvasHeight}px`;
      canvas.width = Math.round(canvasWidth * scale);
      canvas.height = Math.round(canvasHeight * scale);

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(scale, 0, 0, scale, 0, 0);

      if (!savedDrawing) {
        setCanvasSize({ width: canvasWidth, height: canvasHeight });
        return;
      }

      const savedImage = new Image();
      savedImage.src = savedDrawing;
      savedImage.onload = () => {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.drawImage(savedImage, 0, 0, canvasWidth, canvasHeight);
        setHistory([canvas.toDataURL("image/png")]);
        setHistoryIndex(0);
        setCanvasSize({ width: canvasWidth, height: canvasHeight });
      };
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [canvasBackground]);

  function getMouseCanvasPosition(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }

  function getTouchCanvasPosition(e: React.TouchEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    if (!touch) return null;
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (touch.clientX - rect.left) * scaleX,
      y: (touch.clientY - rect.top) * scaleY,
    };
  }

  function prepareContext(ctx: CanvasRenderingContext2D) {
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = tool === "eraser" ? "#ffffff" : colour;
  }

  function drawShape(
    ctx: CanvasRenderingContext2D,
    start: Point,
    end: Point
  ) {
    prepareContext(ctx);
    ctx.beginPath();

    if (tool === "line") {
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
    }

    if (tool === "rectangle") {
      ctx.rect(start.x, start.y, end.x - start.x, end.y - start.y);
    }

    if (tool === "circle") {
      const radius = Math.sqrt(
        Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
      );

      ctx.arc(start.x, start.y, radius, 0, Math.PI * 2);
    }

    ctx.stroke();
  }

  function startDrawingAt(position: Point) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    startPointRef.current = position;
    canvasSnapshotRef.current = ctx.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    );

    if (tool === "pen" || tool === "eraser") {
      prepareContext(ctx);
      ctx.beginPath();
      ctx.moveTo(position.x, position.y);
    }
  }

  function drawAt(position: Point) {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (tool === "pen" || tool === "eraser") {
      prepareContext(ctx);
      ctx.lineTo(position.x, position.y);
      ctx.stroke();
      return;
    }

    const startPoint = startPointRef.current;
    const snapshot = canvasSnapshotRef.current;
    if (!startPoint || !snapshot) return;

    ctx.putImageData(snapshot, 0, 0);
    drawShape(ctx, startPoint, position);
  }

  function startMouseDrawing(e: React.MouseEvent<HTMLCanvasElement>) {
    const position = getMouseCanvasPosition(e);
    if (!position) return;

    startDrawingAt(position);
  }

  function mouseDraw(e: React.MouseEvent<HTMLCanvasElement>) {
    const position = getMouseCanvasPosition(e);
    if (!position) return;

    drawAt(position);
  }

  function startTouchDrawing(e: React.TouchEvent<HTMLCanvasElement>) {
    e.preventDefault();

    const position = getTouchCanvasPosition(e);
    if (!position) return;

    startDrawingAt(position);
  }

  function touchDraw(e: React.TouchEvent<HTMLCanvasElement>) {
    e.preventDefault();

    const position = getTouchCanvasPosition(e);
    if (!position) return;

    drawAt(position);
  }

  function saveCanvasState() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const imageData = canvas.toDataURL("image/png");
    const updatedHistory = history.slice(0, historyIndex + 1);

    updatedHistory.push(imageData);

    localStorage.setItem(STORAGE_KEY, imageData);
    setHistory(updatedHistory);
    setHistoryIndex(updatedHistory.length - 1);
  }

  function restoreCanvasState(imageData: string) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const image = new Image();
    image.src = imageData;

    image.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    };
  }

  function stopDrawing() {
    if (!isDrawing) return;

    setIsDrawing(false);
    startPointRef.current = null;
    canvasSnapshotRef.current = null;
    saveCanvasState();
  }

  function clearCanvas(saveToHistory = true) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCanvasBackground(ctx, canvas.width, canvas.height, canvasBackground);
    localStorage.removeItem(STORAGE_KEY);

    if (saveToHistory) {
      const imageData = canvas.toDataURL("image/png");
      const updatedHistory = history.slice(0, historyIndex + 1);

      updatedHistory.push(imageData);

      localStorage.setItem(STORAGE_KEY, imageData);
      setHistory(updatedHistory);
      setHistoryIndex(updatedHistory.length - 1);
    }
  }

  function undoCanvas() {
    if (historyIndex <= 0) {
      clearCanvas(false);
      localStorage.removeItem(STORAGE_KEY);
      setHistoryIndex(-1);
      return;
    }

    const newIndex = historyIndex - 1;

    restoreCanvasState(history[newIndex]);
    localStorage.setItem(STORAGE_KEY, history[newIndex]);
    setHistoryIndex(newIndex);
  }

  function redoCanvas() {
    if (historyIndex >= history.length - 1) return;

    const newIndex = historyIndex + 1;

    restoreCanvasState(history[newIndex]);
    localStorage.setItem(STORAGE_KEY, history[newIndex]);
    setHistoryIndex(newIndex);
  }

  function downloadCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");

    link.download = "sketchpad-drawing.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <div className="app-shell">
      <AppHeader
        onExport={downloadCanvas}
        onClear={() => clearCanvas(true)}
        colour={colour}
        setColour={setColour}
        brushSize={brushSize}
        setBrushSize={setBrushSize}
        canvasBackground={canvasBackground}
        setCanvasBackground={setCanvasBackground}
        tool={tool}
        setTool={setTool}
        onUndo={undoCanvas}
        onRedo={redoCanvas}
        canUndo={historyIndex >= 0}
        canRedo={historyIndex < history.length - 1}
      />

      <div className="app-grid">
        <CanvasWorkspace
          canvasRef={canvasRef}
          canvasContainerRef={canvasContainerRef}
          canvasWidth={canvasSize.width}
          canvasHeight={canvasSize.height}
          onMouseDown={startMouseDrawing}
          onMouseMove={mouseDraw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startTouchDrawing}
          onTouchMove={touchDraw}
          onTouchEnd={stopDrawing}
        />
      </div>

      <footer className="app-footer">
        <a
          href="https://github.com/AlexKav47/SketchPad-WebApp"
          target="_blank"
          rel="noreferrer noopener"
        >
          View project on GitHub
        </a>
      </footer>
    </div>
  );
}