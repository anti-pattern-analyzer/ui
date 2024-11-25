import React, { useState, useEffect } from "react";
import { Graph } from "react-d3-graph";

const Home = () => {
    const [graphData, setGraphData] = useState({ nodes: [], links: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const graphConfig = {
        directed: true,
        nodeHighlightBehavior: true,
        node: {
            color: "teal",
            size: 400,
            fontSize: 12,
            highlightStrokeColor: "blue",
        },
        link: {
            highlightColor: "lightblue",
            renderLabel: true,
            fontSize: 10,
        },
        height: 600,
        width: 800,
    };

    useEffect(() => {
        const fetchGraphData = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/graphs");
                const data = await response.json();

                if (data.status === "success") {
                    setGraphData({
                        nodes: data.graph.nodes,
                        links: data.graph.links.map((link) => ({
                            ...link,
                            label: `Weight: ${link.weight}`,
                        })),
                    });
                } else {
                    throw new Error(data.message || "Failed to fetch graph data");
                }
            } catch (err) {
                console.error("Error fetching graph data:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchGraphData();
    }, []);

    const handleNodeClick = (nodeId) => {
        console.log(`Clicked on node: ${nodeId}`);
        alert(`Node clicked: ${nodeId}`);
    };

    const handleLinkClick = (source, target) => {
        console.log(`Clicked on link: ${source} -> ${target}`);
        alert(`Link clicked: ${source} -> ${target}`);
    };

    if (loading) return <p>Loading graph...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h1>Interactive Dependency Graph</h1>
            <Graph
                id="dependency-graph"
                data={graphData}
                config={graphConfig}
                onClickNode={handleNodeClick}
                onClickLink={handleLinkClick}
            />
        </div>
    );
};

export default Home;
