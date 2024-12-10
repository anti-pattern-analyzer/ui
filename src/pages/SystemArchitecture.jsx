import React, { useEffect, useState } from "react";
import { Graph } from "react-d3-graph";

const SystemArchitecture = () => {
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
            labelProperty: (link) => `Weight: ${link.weight}, Latency: ${link.avg_latency}ms`,
            fontSize: 10,
        },
        d3: {
            gravity: -500,
            linkLength: 150,
            alphaTarget: 0.05,
            disableLinkForce: false,
        },
        panAndZoom: true,
        height: dimensions.height - 50,
        width: dimensions.width - 50,
    };

    useEffect(() => {
        const loadGraphData = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/graphs");
                const data = await response.json();
                if (data.status === "success") {
                    setGraphData(data.graph);
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

        loadGraphData();

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
        alert(`Node clicked: ${nodeId}`);
    };

    const handleLinkClick = (source, target) => {
        const link = graphData.links.find(
            (link) => link.source === source && link.target === target
        );
        if (link) {
            alert(
                `Link Details:\nSource: ${source}\nTarget: ${target}\nWeight: ${link.weight}\nAverage Latency: ${link.avg_latency}ms`
            );
        }
    };

    if (loading) return <p>Loading graph...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
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

export default SystemArchitecture;
