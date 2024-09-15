import React, { useEffect, useRef, useState } from "react";

export type GraphNode = {
  x: number;
  y: number;
  size: number;
};

export type GraphEdge = [number, number];

interface GraphProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

const drawNode = (
  ctx: CanvasRenderingContext2D | null,
  node: GraphNode,
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
    ctx.arc(
      node.x + translateX,
      node.y + translateY,
      node.size / 2,
      0,
      2 * Math.PI
    );
    ctx.clip();
    ctx.drawImage(
      img,
      node.x + translateX - node.size / 2,
      node.y + translateY - node.size / 2,
      node.size,
      node.size
    );
    ctx.restore();
  };

  // Draw node label
  ctx.fillStyle = "black";
  ctx.font = "bold 14px serif";
  ctx.fillText(`${index}`, node.x + translateX - 5, node.y + translateY + 5);
};

const drawEdges = (
  ctx: CanvasRenderingContext2D | null,
  edges: GraphEdge[],
  nodes: GraphNode[],
  translateX: number,
  translateY: number
) => {
  if (!ctx) return;

  edges.forEach(([start, end]) => {
    ctx.beginPath();
    ctx.moveTo(nodes[start].x + translateX, nodes[start].y + translateY);
    ctx.lineTo(nodes[end].x + translateX, nodes[end].y + translateY);
    ctx.strokeStyle = "grey";
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
        drawNode(ctx, node, translateX, translateY, index);
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
        style={{ backgroundColor: "#101010" }}
      />
    </div>
  );
};
