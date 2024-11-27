export const fetchGraphData = async () => {
    const response = await fetch("http://localhost:8000/api/graphs");
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    const data = await response.json();
    if (data.status === "success") {
        return {
            nodes: data.graph.nodes.map((node) => ({ id: node.id })),
            links: data.graph.links.map((link) => ({
                source: link.source,
                target: link.target,
                label: `Weight: ${link.weight}`,
            })),
        };
    } else {
        throw new Error(data.message || "Failed to fetch graph data");
    }
};
