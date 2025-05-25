export const fetchGraphData = async () => {
    try {
        const response = await fetch("http://167.172.83.56:8000/api/graph");
        const result = await response.json();

        console.log("📡 API Response:", result);

        if (!result.graph) {
            console.error("❌ Invalid Graph Data:", result);
            return { nodes: [], links: [] };
        }

        return {
            nodes: result.graph.nodes || [],
            links: result.graph.links.map(link => ({
                source: link.source ?? "Unknown Source",
                target: link.target ?? "Unknown Target",
                method: link.method ?? "Unknown",
                type: link.type ?? "Unknown",
                calls: link.calls ?? "Not Available",
                avg_duration: link.avg_duration ?? "Not Available",
                weight: link.weight ?? "Not Available",
            }))
        };
    } catch (error) {
        console.error("❌ Error Fetching Graph Data:", error);
        return { nodes: [], links: [] };
    }
};


export const fetchChangePointGraph = async (start_time, end_time, metric) => {
    try {
        const response = await fetch(
            `http://167.172.83.56:8000/api/metrics/change-points?start_time=${start_time}&end_time=${end_time}&metric=${metric}`);
        const result = await response.json();

        // console.log("API Response:", result);

        if (!result.data) {
            console.error("Invalid Plot Data:", result);
            return [];
        }

        return result.data;
    } catch (error) {
        console.error("❌ Error Fetching Plot Data:", error);
        return { nodes: [], links: [] };
    }
};
