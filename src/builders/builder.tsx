const WINDOW_WIDTH = window.innerWidth;
const WINDOW_HEIGHT = window.innerHeight;

export interface Node {
  id: number;
  x: number;
  y: number;
}

interface ExtendedNode extends Node {
  level: number;
  children: ExtendedNode[];
}

export interface Edge {
  source: number;
  target: number;
}

const createNodeTree = (edges: Edge[]) => {
  // Mappa per tenere traccia dei nodi e livelli
  const nodesMap: Map<number, ExtendedNode> = new Map();

  // Formatta i nodi iniziali (livello 0)
  const rootNode: ExtendedNode = {
    id: 0,
    x: WINDOW_WIDTH / 2,
    y: WINDOW_HEIGHT / 2,
    level: 0,
    children: [],
  };

  nodesMap.set(rootNode.id, rootNode);

  // Costruisce la struttura ramificata del grafo
  edges.forEach((edge) => {
    const { source, target } = edge;

    let sourceNode = nodesMap.get(source);
    if (!sourceNode) {
      // Se il nodo sorgente non esiste, lo creiamo al livello 0
      sourceNode = {
        id: source,
        x: WINDOW_WIDTH / 2,
        y: WINDOW_HEIGHT / 2,
        level: 0,
        children: [],
      };
      nodesMap.set(source, sourceNode);
    }

    let targetNode = nodesMap.get(target);
    if (!targetNode) {
      // Creiamo il nodo figlio con un livello incrementato rispetto al genitore
      targetNode = {
        id: target,
        x: 0,
        y: 0,
        level: sourceNode.level + 1,
        children: [],
      };
      nodesMap.set(target, targetNode);
    }

    sourceNode.children.push(targetNode);
  });

  return { rootNode, nodesMap };
};

export function structuralLayout(edges: Edge[]): Node[] {
  // Crea la struttura ramificata del grafo
  const { rootNode, nodesMap } = createNodeTree(edges);

  // Dispone in modo radiale i nodi del livello 1
  const angleStep = (2 * Math.PI) / rootNode.children.length;
  rootNode.children.forEach((child, index) => {
    child.x = rootNode.x + 200 * Math.cos(angleStep * index);
    child.y = rootNode.y + 200 * Math.sin(angleStep * index);
  });

  // Dispone in modo radiale i nodi dei livello 2
  const level2Nodes = rootNode.children.flatMap((child) => child.children);
  const angleStep2 = (2 * Math.PI) / level2Nodes.length;
  level2Nodes.forEach((child, index) => {
    child.x = rootNode.x + 400 * Math.cos(angleStep2 * index);
    child.y = rootNode.y + 400 * Math.sin(angleStep2 * index);
  });

  // Convertiamo i nodi estesi alla struttura base Node[]
  const result: Node[] = [];
  nodesMap.forEach((node) => {
    result.push({
      id: node.id,
      x: node.x,
      y: node.y,
    });
  });

  return result;
}
