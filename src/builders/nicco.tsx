import { GraphNode } from "../Graph";

const NODE_SIZE = 60;

const WINDOW_WIDTH = window.innerWidth;
const WINDOW_HEIGHT = window.innerHeight;

export interface Node extends GraphNode {
  id: number;
  vx?: number; // velocità lungo x
  vy?: number; // velocità lungo y
}

export interface Edge {
  source: number;
  target: number;
}

// Costanti per le forze
const REPULSION_STRENGTH = 3000; // Forza di repulsione (dimezzata rispetto a prima)
const SPRING_STRENGTH = 0.01; // Forza della "molla" tra i nodi collegati
const DAMPING = 0.9; // Smorzamento per rallentare il movimento
const FORCE_ITERATIONS = 1000; // Numero di iterazioni per stabilizzare il layout

// Funzione principale di layout
export function layout(edges: Edge[]): Node[] {
  // Inizializza i nodi con posizioni casuali e velocità nulle
  const nodes = edges.reduce((acc, { source, target }) => {
    const sourceNode = acc.find((node) => node.id === source);
    const targetNode = acc.find((node) => node.id === target);
    if (!sourceNode) {
      acc.push({
        id: source,
        x: Math.random() * WINDOW_WIDTH,
        y: Math.random() * WINDOW_HEIGHT,
        vx: 0,
        vy: 0,
        size: NODE_SIZE,
      });
    }
    if (!targetNode) {
      acc.push({
        id: target,
        x: Math.random() * WINDOW_WIDTH,
        y: Math.random() * WINDOW_HEIGHT,
        vx: 0,
        vy: 0,
        size: NODE_SIZE,
      });
    }
    return acc;
  }, [] as Node[]);

  // Preleva il nodo con id 0
  const node0 = nodes.find((node) => node.id === 0);
  if (node0) {
    // Da al nodo 0 una posizione fissa al centro
    node0.x = WINDOW_WIDTH / 2;
    node0.y = WINDOW_HEIGHT / 2;
    // Dimensione doppiamente grande
    node0.size = NODE_SIZE * 2;
  }

  // Itera più volte per stabilizzare il layout
  for (let i = 0; i < FORCE_ITERATIONS; i++) {
    // Applica la forza di repulsione tra i nodi
    nodes.forEach((nodeA) => {
      nodes.forEach((nodeB) => {
        if (nodeA !== nodeB && nodeA && nodeB) {
          const dx = nodeA.x - nodeB.x;
          const dy = nodeA.y - nodeB.y;
          const distance = Math.sqrt(dx * dx + dy * dy) + 0.01; // evita divisioni per zero

          const minDistance = nodeA.size / 2 + nodeB.size / 2;

          // Verifica se la distanza è inferiore a NODE_SIZE (evita sovrapposizioni)
          if (distance < minDistance) {
            const overlapRepulsion = (minDistance - distance) * 0.5; // Applicazione più leggera della repulsione
            nodeA.vx! += (dx / distance) * overlapRepulsion;
            nodeA.vy! += (dy / distance) * overlapRepulsion;
            nodeB.vx! -= (dx / distance) * overlapRepulsion;
            nodeB.vy! -= (dy / distance) * overlapRepulsion;
          }

          const repulsion = REPULSION_STRENGTH / (distance * distance);
          nodeA.vx! += (dx / distance) * repulsion;
          nodeA.vy! += (dy / distance) * repulsion;
        }
      });
    });

    // Applica la forza di attrazione sugli archi (simile a molle)
    edges.forEach(({ source, target }) => {
      const sourceNode = nodes.find((node) => node.id === source);
      const targetNode = nodes.find((node) => node.id === target);
      if (sourceNode && targetNode) {
        const dx = targetNode.x - sourceNode.x;
        const dy = targetNode.y - sourceNode.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const attraction = (distance - 100) * SPRING_STRENGTH; // distanza ideale di 100
        const fx = (dx / distance) * attraction;
        const fy = (dy / distance) * attraction;

        if (sourceNode.vx && sourceNode.vy) {
          sourceNode.vx += fx;
          sourceNode.vy += fy;
        }

        if (targetNode.vx && targetNode.vy) {
          targetNode.vx -= fx;
          targetNode.vy -= fy;
        }
      }
    });

    // Aggiorna le posizioni dei nodi e applica il damping
    nodes.forEach((node) => {
      if (!node || !node.vx || !node.vy) return;
      node.vx *= DAMPING;
      node.vy *= DAMPING;
      node.x += node.vx;
      node.y += node.vy;
    });
  }

  // Trasla tutti i nodi per far si che il nodo 0 sia al centro
  if (node0) {
    const translateX = WINDOW_WIDTH / 2 - node0.x;
    const translateY = WINDOW_HEIGHT / 2 - node0.y;
    nodes.forEach((node) => {
      if (node) {
        node.x += translateX;
        node.y += translateY;
      }
    });
  }

  return nodes;
}
