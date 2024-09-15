import React, { useEffect, useRef, useState } from "react";

type Node = {
  x: number;
  y: number;
};

type Edge = [number, number];

interface GraphProps {
  nodes: Node[];
  edges: Edge[];
}

const drawNode = (
  ctx: CanvasRenderingContext2D | null,
  node: Node,
  size: number,
  translateX: number,
  translateY: number,
  index: number
) => {
  if (!ctx) return;

  const img = new Image();
  img.src = `https://picsum.photos/400/400?random=${index}`;
  img.onload = () => {
    ctx.save();
    ctx.beginPath();
    ctx.arc(node.x + translateX, node.y + translateY, size / 2, 0, 2 * Math.PI);
    ctx.clip();
    ctx.drawImage(
      img,
      node.x + translateX - size / 2,
      node.y + translateY - size / 2,
      size,
      size
    );
    ctx.restore();
  };

  // Draw node label
  ctx.fillStyle = "white";
  ctx.font = "bold 14px serif";
  ctx.fillText(`${index}`, node.x + translateX - 5, node.y + translateY + 5);
};

const drawEdges = (
  ctx: CanvasRenderingContext2D | null,
  edges: Edge[],
  nodes: Node[],
  translateX: number,
  translateY: number
) => {
  if (!ctx) return;

  edges.forEach(([start, end]) => {
    ctx.beginPath();
    ctx.moveTo(nodes[start].x + translateX, nodes[start].y + translateY);
    ctx.lineTo(nodes[end].x + translateX, nodes[end].y + translateY);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.stroke();
  });
};

export const Graph: React.FC<GraphProps> = ({ edges, nodes }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (ctx && canvas) {
      // Clear canvas before drawing
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw edges
      drawEdges(ctx, edges, nodes, translateX, translateY);

      // Draw nodes
      nodes.forEach((node, index) => {
        drawNode(ctx, node, 70, translateX, translateY, index);
      });
    }
  }, [edges, nodes, translateX, translateY]);

  const handleMouseDown = () => {
    setIsDragging(true); // Start dragging when mouse is pressed
  };

  const handleMouseUp = () => {
    setIsDragging(false); // Stop dragging when mouse is released
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setTranslateX((prev) => prev + e.movementX);
      setTranslateY((prev) => prev + e.movementY);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        style={{ backgroundColor: "#fff" }}
      />
    </div>
  );
};
