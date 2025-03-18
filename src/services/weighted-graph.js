const BASE_URL = "http://localhost:8000/api/graphs/weight";

export const fetchWeightedDependencyGraph = async (startTime, endTime, weight_type) => {
    try {
        const endpoint = `?start_time=${startTime}&end_time=${endTime}&weight_type=${weight_type}`;
        const response = await fetch(`${BASE_URL}${endpoint}`);

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data = await response.json();
        if (data) {
            return data;
        } else {
            throw new Error(data.message || `Failed to fetch weighted dependency graph`);
        }
    } catch (error) {
        console.error(`Error fetching weighted graph:`, error);
        return null;
    }
};