import React, { useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import Select from "react-select";
import "chart.js/auto";

const AntiPatternInsights = () => {
    const allInsights = [
        { service: "Service-A", name: "High Fan-Out", count: 5, severity: "High", date: "2024-11-20" },
        { service: "Service-B", name: "Excessive Dependency", count: 3, severity: "Medium", date: "2024-11-18" },
        { service: "Service-C", name: "Service Bottleneck", count: 2, severity: "High", date: "2024-11-17" },
        { service: "Service-D", name: "High Fan-Out", count: 4, severity: "Medium", date: "2024-11-16" },
        { service: "Service-B", name: "Service Bottleneck", count: 1, severity: "Low", date: "2024-11-15" },
    ];

    const allServices = [...new Set(allInsights.map((insight) => insight.service))];
    const allPatterns = [...new Set(allInsights.map((insight) => insight.name))];

    const serviceOptions = allServices.map((service) => ({
        value: service,
        label: service,
    }));

    const patternOptions = allPatterns.map((pattern) => ({
        value: pattern,
        label: pattern,
    }));

    const [selectedServices, setSelectedServices] = useState(serviceOptions);
    const [selectedPatterns, setSelectedPatterns] = useState(patternOptions);

    const filteredInsights = allInsights.filter(
        (insight) =>
            selectedServices.some((selected) => selected.value === insight.service) &&
            selectedPatterns.some((selected) => selected.value === insight.name)
    );

    // Helper function to create chart data
    const createChartData = (type) => {
        if (type === "bar") {
            return {
                labels: [...new Set(filteredInsights.map((insight) => insight.service))],
                datasets: selectedPatterns.map((pattern) => ({
                    label: pattern.value,
                    data: filteredInsights
                        .filter((insight) => insight.name === pattern.value)
                        .map((insight) => insight.count),
                    backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
                        Math.random() * 255
                    )}, ${Math.floor(Math.random() * 255)}, 0.6)`,
                })),
            };
        }
        if (type === "severity") {
            return {
                labels: allPatterns,
                datasets: [
                    {
                        label: "High",
                        data: allPatterns.map(
                            (pattern) =>
                                filteredInsights.filter(
                                    (insight) => insight.name === pattern && insight.severity === "High"
                                ).length
                        ),
                        backgroundColor: "red",
                    },
                    {
                        label: "Medium",
                        data: allPatterns.map(
                            (pattern) =>
                                filteredInsights.filter(
                                    (insight) => insight.name === pattern && insight.severity === "Medium"
                                ).length
                        ),
                        backgroundColor: "orange",
                    },
                    {
                        label: "Low",
                        data: allPatterns.map(
                            (pattern) =>
                                filteredInsights.filter(
                                    (insight) => insight.name === pattern && insight.severity === "Low"
                                ).length
                        ),
                        backgroundColor: "green",
                    },
                ],
            };
        }
        if (type === "line") {
            return {
                labels: [...new Set(filteredInsights.map((insight) => insight.date))].sort(),
                datasets: selectedPatterns.map((pattern) => ({
                    label: pattern.value,
                    data: filteredInsights
                        .filter((insight) => insight.name === pattern.value)
                        .map((insight) => insight.count),
                    borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
                        Math.random() * 255
                    )}, ${Math.floor(Math.random() * 255)}, 1)`,
                    fill: false,
                })),
            };
        }
    };

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">Anti-Pattern Insights</h1>

            {/* Filters */}
            <div className="flex gap-6">
                <div className="flex-1">
                    <h2 className="text-lg font-semibold">Select Services</h2>
                    <Select
                        isMulti
                        options={serviceOptions}
                        value={selectedServices}
                        onChange={(selected) => setSelectedServices(selected)}
                        placeholder="Search and select services..."
                        isSearchable
                    />
                </div>
                <div className="flex-1">
                    <h2 className="text-lg font-semibold">Select Anti-Patterns</h2>
                    <Select
                        isMulti
                        options={patternOptions}
                        value={selectedPatterns}
                        onChange={(selected) => setSelectedPatterns(selected)}
                        placeholder="Search and select anti-patterns..."
                        isSearchable
                    />
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Chart 1 */}
                <div className="bg-gray-100 p-4 rounded shadow">
                    <h2 className="text-lg font-bold mb-4">Service-Specific Anti-Pattern Insights</h2>
                    <Bar
                        data={createChartData("bar")}
                        options={{
                            responsive: true,
                            plugins: { legend: { position: "top" } },
                        }}
                    />
                </div>

                {/* Chart 2 */}
                <div className="bg-gray-100 p-4 rounded shadow">
                    <h2 className="text-lg font-bold mb-4">Anti-Pattern Severity</h2>
                    <Bar
                        data={createChartData("severity")}
                        options={{
                            responsive: true,
                            plugins: { legend: { position: "top" } },
                        }}
                    />
                </div>

                {/* Chart 3 */}
                <div className="bg-gray-100 p-4 rounded shadow">
                    <h2 className="text-lg font-bold mb-4">Anti-Pattern Trends</h2>
                    <Line
                        data={createChartData("line")}
                        options={{
                            responsive: true,
                            plugins: { legend: { position: "top" } },
                        }}
                    />
                </div>

                {/* Chart 4 */}
                <div className="bg-gray-100 p-4 rounded shadow">
                    <h2 className="text-lg font-bold mb-4">Service Impact Analysis</h2>
                    <Bar
                        data={createChartData("bar")}
                        options={{
                            responsive: true,
                            plugins: { legend: { position: "top" } },
                        }}
                    />
                </div>
            </div>

            {/* Historic Data Download */}
            <div className="text-right">
                <button
                    onClick={() => {
                        const blob = new Blob([JSON.stringify(filteredInsights, null, 2)], {
                            type: "application/json",
                        });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = "anti-pattern-insights.json";
                        a.click();
                    }}
                    className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
                >
                    Download Historic Data
                </button>
            </div>
        </div>
    );
};

export default AntiPatternInsights;
