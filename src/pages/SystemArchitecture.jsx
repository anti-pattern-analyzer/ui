import React, { useEffect, useState } from "react";
import { Graph } from "react-d3-graph";
import { fetchGraphData } from "@/services/graphs.js";

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
        const loadGraphData = async () => {
            try {
                const data = await fetchGraphData();
                setGraphData(data);
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

export default SystemArchitecture;
