import React, { useMemo } from "react";
import { Graph } from "./Graph";
import { layout } from "./builders/nicco";

const EDGES = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [0, 5],
  [0, 6],
  [0, 7],
  [0, 8],
  [0, 9],
  [0, 10],
  [0, 11],
  [0, 12],
  [0, 13],
  [13, 14],
  [13, 15],
  [13, 16],
  [13, 17],
  [17, 18],
  [17, 19],
] as [number, number][];

function App() {
  const edges = EDGES.map(([source, target]) => ({ source, target }));
  const nodes = useMemo(() => {
    const calcNodes = layout(edges);
    return calcNodes;
  }, [edges]);

  return (
    <div className="App">
      <Graph nodes={nodes} edges={EDGES} nodeSize={70} />
    </div>
  );
}

export default App;
