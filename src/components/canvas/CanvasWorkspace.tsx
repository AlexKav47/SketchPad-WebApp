import type React from "react";

type CanvasWorkspaceProps = {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  canvasContainerRef: React.RefObject<HTMLDivElement | null>;
  canvasWidth: number;
  canvasHeight: number;
  onMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
  onTouchStart: (e: React.TouchEvent<HTMLCanvasElement>) => void;
  onTouchMove: (e: React.TouchEvent<HTMLCanvasElement>) => void;
  onTouchEnd: () => void;
};

export function CanvasWorkspace({
  canvasRef,
  canvasContainerRef,
  canvasWidth,
  canvasHeight,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseLeave,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
}: CanvasWorkspaceProps) {
  return (
    <main className="workspace-panel">

      <div ref={canvasContainerRef} className="canvas-frame">
        <canvas
          ref={canvasRef}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          className="canvas-area"
          style={{ width: `${canvasWidth}px`, height: `${canvasHeight}px` }}
        />
      </div>

      <p className="canvas-description">
        Draw freehand with the pen, erase mistakes, add simple shapes, and export your work as a PNG.
      </p>
    </main>
  );
}
