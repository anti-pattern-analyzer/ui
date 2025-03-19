import React, { useRef, useEffect, useState } from "react";
import { fetchWeightedDependencyGraph } from "../../services/weighted-graph.js";
import ForceGraph2D from "react-force-graph-2d";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { data } from "autoprefixer";

const WeightedGraphViewer = () => {
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [weightType, setWeightType] = useState("CO");
  const [weightedGraph, setWeightedGraph] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hoverNode, setHoverNode] = useState(null);
  const [positionsLocked, setPositionsLocked] = useState(false);

  const fgRef = useRef();
  const sidePanelRef = useRef();

  const convertToMicroseconds = (date) => {
    return date ? date.getTime() * 1000 : null;
  };

  const transformData = (data) => ({
    nodes: data.nodes.map((node) => ({
      id: node.id,
      importance: node.absolute_importance || 0,
      dependence: node.absolute_dependence || 0,
    })),
    links: data.edges.map((edge) => ({
      source: edge.source,
      target: edge.target,
      weight: edge.weight || 1,
    })),
  });

  useEffect(() => {
    if (fgRef.current) {
      const graph = fgRef.current;
      graph.d3Force("link").distance((link) => link.weight * 10);
    }
  }, [weightedGraph]);

  useEffect(() => {
    if (hoverNode && sidePanelRef.current) {
      const nodeElement = document.getElementById(`node-${hoverNode.id}`);
      if (nodeElement) {
        nodeElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [hoverNode]);

  useEffect(() => {
    setStartTime(new Date(new Date().getTime() - 15 * 60 * 1000));
    setEndTime(new Date());
    handleFetchGraph();
  }, []);

  const handleFetchGraph = async () => {
    setLoading(true);
    setError(null);
    setPositionsLocked(false);

    const startTimeMicro = convertToMicroseconds(startTime);
    const endTimeMicro = convertToMicroseconds(endTime);

    try {
      const response = await fetchWeightedDependencyGraph(
        startTimeMicro,
        endTimeMicro,
        weightType
      );
      if (response && response.status === "success") {
        if (response.data == null) {
          setWeightedGraph({ nodes: [], links: [] });
          setError("No data found for the selected time range");
          return;
        }

        if (
          response.data.nodes.length === 0 &&
          response.data.edges.length === 0
        ) {
          setWeightedGraph({ nodes: [], links: [] });
          setError("No data found for the selected time range");
          return;
        } else {
          setWeightedGraph(transformData(response.data));
        }
      } else {
        setError("Failed to fetch valid weighted dependency graph data");
        setWeightedGraph({ nodes: [], links: [] });
      }
    } catch (err) {
      console.error(err);
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 flex space-x-6 relative flex-grow">
      <div id="fetchDataDiv" className="w-3/4 flex flex-col space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">
          📊 Weighted Dependency Graph
        </h1>
        <div className="border-black text-white p-2 rounded shadow-md flex items-center space-x-4">
          <div className="flex flex-shrink">
            <div className="flex items-center space-x-2">
              <label className="block text-black">Start Time:</label>
              <DatePicker
                selected={startTime}
                onChange={(date) => setStartTime(date)}
                showTimeSelect
                dateFormat="Pp"
                className="p-2 border rounded bg-gray-700 text-white"
                placeholderText="Select start time"
              />
            </div>
          </div>
          <div className="flex flex-shrink">
            <div className="flex items-center space-x-2">
              <label className="block text-black">End Time:</label>
              <DatePicker
                selected={endTime}
                onChange={(date) => setEndTime(date)}
                showTimeSelect
                dateFormat="Pp"
                className="p-2 border rounded bg-gray-700 text-white"
                placeholderText="Select end time"
              />
            </div>
          </div>
          <div className="flex flex-grow">
            <div className="flex items-center space-x-2">
              <label className="block text-black">Weight Type:</label>
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
          </div>
          <button
            className="bg-teal-500 text-black px-4 py-2 rounded hover:bg-teal-600"
            onClick={handleFetchGraph}
          >
            Fetch Graph
          </button>
        </div>
        {loading && (
          <p className="text-lg text-gray-700">
            🔄 Loading Weighted Dependency Graph...
          </p>
        )}
        {error && <p className="text-red-500">❌ {error}</p>}
        {weightedGraph.nodes.length > 0 && (
          <div className="bg-white p-4 rounded shadow-md relative">
            <ForceGraph2D
              ref={fgRef}
              graphData={weightedGraph}
              nodeAutoColorBy="id"
              linkDirectionalArrowLength={(link) =>
                Math.max(10, link.weight * 2)
              }
              linkDirectionalArrowRelPos={1}
              linkCurvature={0.1}
              linkWidth={(link) => Math.max(2, link.weight / 2)}
              linkDirectionalParticles={4}
              linkDirectionalParticleSpeed={(link) => link.weight / 50}
              onNodeHover={(node) => setHoverNode(node || null)}
            />
          </div>
        )}
      </div>
      <div
        ref={sidePanelRef}
        id="sidePanelNodeInfoDiv"
        className="w-1/4 bg-gray-100 p-4 rounded shadow-md fixed right-0 top-14 bottom-0 overflow-y-auto"
      >
        <h2 className="text-xl font-bold text-gray-700">🔢 Node Information</h2>
        <div className="mt-2 space-y-2">
          {weightedGraph.nodes.map((node) => (
            <div
              key={node.id}
              id={`node-${node.id}`}
              className={`p-2 border rounded cursor-pointer ${
                hoverNode && hoverNode.id === node.id
                  ? "bg-yellow-300"
                  : "bg-white"
              }`}
            >
              <p className="font-bold">{node.id}</p>
              <p>Importance: {node.importance.toFixed(2)}</p>
              <p>Dependence: {node.dependence.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeightedGraphViewer;
