import React, { useRef, useEffect, useState } from "react";
import { fetchWeightedDependencyGraph } from "../../services/weighted-graph.js";
import ForceGraph2D from "react-force-graph-2d";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const WeightedGraphViewer = () => {
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [weightType, setWeightType] = useState("CoExecution");
  const [weightedGraph, setWeightedGraph] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hoverNode, setHoverNode] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const convertToMicroseconds = (date) => {
    return date ? date.getTime() * 1000 : null;
  };

  const fgRef = useRef();

  const transformData = (data) => ({
    nodes: data.nodes.map((node) => ({
      id: node.id,
      importance: node.importance || 0, // Ensure values exist
      dependence: node.dependence || 0,
    })),
    links: data.edges.map((edge) => ({
      source: edge.source,
      target: edge.target,
      weight: edge.weight,
    })),
  });

  useEffect(() => {
    if (fgRef.current) {
      fgRef.current.d3Force("link").distance((link) => link.weight * 10);
    }
  }, [weightedGraph]);

  const handleFetchGraph = async () => {
    setLoading(true);
    setError(null);

    const startTimeMicro = convertToMicroseconds(startTime);
    const endTimeMicro = convertToMicroseconds(endTime);

    try {
      const response = await fetchWeightedDependencyGraph(
        startTimeMicro,
        endTimeMicro,
        weightType
      );
      if (response && response.status === "success" && response.data) {
        if (response.data.nodes.length === 0 && response.data.edges.length === 0) {
          setError("No nodes and edges found in the weighted dependency graph");
          return;
        }
        setWeightedGraph({
          nodes: response.data.nodes,
          edges: response.data.edges,
        });
      } else {
        setError("Failed to fetch valid weighted dependency graph data");
      }
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 relative">
      <h1 className="text-2xl font-bold text-gray-800">
        📊 Weighted Dependency Graph
      </h1>

      <div className="border-black text-white p-4 rounded shadow-md flex items-center space-x-4">
        <div>
          <label className="block text-white">Start Time:</label>
          <DatePicker
            selected={startTime}
            onChange={(date) => setStartTime(date)}
            showTimeSelect
            dateFormat="Pp"
            className="p-2 border rounded bg-gray-700 text-white"
            placeholderText="Select start time"
          />
        </div>

        <div>
          <label className="block text-white">End Time:</label>
          <DatePicker
            selected={endTime}
            onChange={(date) => setEndTime(date)}
            showTimeSelect
            dateFormat="Pp"
            className="p-2 border rounded bg-gray-700 text-white"
            placeholderText="Select end time"
          />
        </div>

        <div>
          <label className="block text-white">Weight Type:</label>
          <select
            value={weightType}
            onChange={(e) => setWeightType(e.target.value)}
            className="p-2 border rounded bg-gray-700 text-white"
          >
            <option value="CO">CoExecution</option>
            <option value="Lat">Latency</option>
            <option value="Freq">Frequency</option>
          </select>
        </div>

        <button
          className="bg-teal-500 text-black px-4 py-2 rounded hover:bg-teal-600"
          onClick={handleFetchGraph}
        >
          Fetch Graph
        </button>
      </div>

      {loading && <p className="text-lg text-gray-700">🔄 Loading Weighted Dependency Graph...</p>}
      {error && <p className="text-red-500">❌ {error}</p>}

      {weightedGraph.nodes.length > 0 && (
        <div className="bg-white p-4 rounded shadow-md relative">
          <ForceGraph2D
            ref={fgRef}
            graphData={transformData(weightedGraph)}
            nodeAutoColorBy="id"
            linkDirectionalArrowLength={(link) => Math.max(10, link.weight * 2)}
            linkDirectionalArrowRelPos={1}
            linkCurvature={0.1}
            linkWidth={(link) => Math.max(2, link.weight / 2)}
            linkDirectionalParticles={4}
            linkDirectionalParticleSpeed={(link) => link.weight / 50}
            
            onNodeHover={(node) => {
                if (node) {
                  // Lock node in place when hovered
                  node.fx = node.x;
                  node.fy = node.y;
                  setHoverNode(node);
                  setTooltipPosition({ x: node.x, y: node.y });
                } else {
                  // Release node when not hovered
                  if (hoverNode) {
                    hoverNode.fx = null;
                    hoverNode.fy = null;
                  }
                  setHoverNode(null);
                }
              }}
              

            nodeCanvasObject={(node, ctx, globalScale) => {
              const radius = 8;
              ctx.beginPath();
              ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
              ctx.fillStyle = hoverNode === node ? "red" : "blue";
              ctx.fill();
              ctx.strokeStyle = "black";
              ctx.lineWidth = 2;
              ctx.stroke();

              // Draw node labels
              const label = node.id;
              ctx.font = `${Math.max(12 / globalScale, 4)}px Sans-Serif`;
              ctx.fillStyle = "black";
              ctx.textAlign = "center";
              ctx.fillText(label, node.x, node.y + radius + 12);
            }}
          />

          {/* Tooltip for hovered node */}
          {hoverNode && (
            <div
              style={{
                position: "absolute",
                left: tooltipPosition.x + 20,
                top: tooltipPosition.y + 20,
                background: "rgba(0, 0, 0, 0.75)",
                color: "white",
                padding: "8px",
                borderRadius: "5px",
                fontSize: "14px",
                pointerEvents: "none",
                transform: "translate(-50%, -50%)",
                whiteSpace: "nowrap",
              }}
            >
              <p><strong>📌 {hoverNode.id}</strong></p>
              <p>🔹 Importance: {hoverNode.importance}</p>
              <p>🔹 Dependence: {hoverNode.dependence}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WeightedGraphViewer;
