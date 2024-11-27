import React, { useState, useEffect } from "react";
import { Graph } from "react-d3-graph";

const Home = () => {
    const [graphData, setGraphData] = useState({ nodes: [], links: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dimensions, setDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    const graphConfig = {
        directed: true,
        nodeHighlightBehavior: true,
        node: {
            color: "#008080",
            size: 400,
            fontSize: 12,
            highlightStrokeColor: "blue",
        },
        link: {
            highlightColor: "#ADD8E6",
            renderLabel: true,
            labelProperty: "label",
            fontSize: 10,
        },
        d3: {
            gravity: -500,
            linkLength: 150,
            alphaTarget: 0.05,
            disableLinkForce: false,
        },
        panAndZoom: true,
        height: dimensions.height,
        width: dimensions.width,
    };

    useEffect(() => {
        const fetchGraphData = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/graphs");
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();

                if (data.status === "success") {
                    setGraphData({
                        nodes: data.graph.nodes.map((node) => ({ id: node.id })),
                        links: data.graph.links.map((link) => ({
                            source: link.source,
                            target: link.target,
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

        const handleResize = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
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
                d3={{ translateX: dimensions.width / 2, translateY: dimensions.height / 2 }}
            />
        </div>
    );
};

export default Home;
