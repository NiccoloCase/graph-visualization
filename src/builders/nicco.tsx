const WINDOW_WIDTH = window.innerWidth;
const WINDOW_HEIGHT = window.innerHeight;

const NODE_SIZE = 70;
const MIN_DISTANCE = NODE_SIZE + 5;

export interface Node {
  id: number;
  x: number;
  y: number;
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
      });
    }
    if (!targetNode) {
      acc.push({
        id: target,
        x: Math.random() * WINDOW_WIDTH,
        y: Math.random() * WINDOW_HEIGHT,
        vx: 0,
        vy: 0,
      });
    }
    return acc;
  }, [] as Node[]);

  // Itera più volte per stabilizzare il layout
  for (let i = 0; i < FORCE_ITERATIONS; i++) {
    // Applica la forza di repulsione tra i nodi
    nodes.forEach((nodeA) => {
      nodes.forEach((nodeB) => {
        if (nodeA !== nodeB && nodeA && nodeB) {
          const dx = nodeA.x - nodeB.x;
          const dy = nodeA.y - nodeB.y;
          const distance = Math.sqrt(dx * dx + dy * dy) + 0.01; // evita divisioni per zero

          // Verifica se la distanza è inferiore a NODE_SIZE (evita sovrapposizioni)
          if (distance < MIN_DISTANCE) {
            const overlapRepulsion = (MIN_DISTANCE - distance) * 0.5; // Applicazione più leggera della repulsione
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

  return nodes;
}
