import React, { useMemo, useState } from "react";
import { Graph } from "./Graph";
import { layout } from "./builders/nicco";
import { EDGES } from "./edges";

function App() {
  const [generationId, setGenerationId] = useState<number>(0);
  const edges = EDGES.map(([source, target]) => ({ source, target }));
  const nodes = useMemo(() => {
    const calcNodes = layout(edges);
    return calcNodes;
  }, [edges, generationId]);

  return (
    <div className="App">
      <Graph nodes={nodes} edges={EDGES} />
      <button
        onClick={() => setGenerationId((prev) => prev + 1)}
        style={{
          background: "black",
          color: "white",
          padding: "10px",
          position: "absolute",
          top: 10,
          right: 10,
          borderRadius: "5px",
        }}
      >
        Regenerate
      </button>
    </div>
  );
}

export default App;
