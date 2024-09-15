const WINDOW_WIDTH = window.innerWidth;
const WINDOW_HEIGHT = window.innerHeight;

export interface Node {
  id: number;
  x: number;
  y: number;
}

export interface Edge {
  source: number;
  target: number;
}

export function layout(edges: Edge[]): Node[] {
  // convert edges to nodes with random positions
  const nodes = edges.reduce((acc, { source, target }) => {
    const sourceNode = acc.find((node) => node.id === source);
    const targetNode = acc.find((node) => node.id === target);
    if (!sourceNode) {
      acc.push({
        id: source,
        x: Math.random() * WINDOW_WIDTH,
        y: Math.random() * WINDOW_HEIGHT,
      });
    }
    if (!targetNode) {
      acc.push({
        id: target,
        x: Math.random() * WINDOW_WIDTH,
        y: Math.random() * WINDOW_HEIGHT,
      });
    }
    return acc;
  }, [] as Node[]);
  return nodes;
}
