import React from "react";

const AntiPatternInsights = () => {
    const insights = [
        { name: "High Fan-Out", count: 5 },
        { name: "Excessive Dependency", count: 3 },
        { name: "Service Bottleneck", count: 2 },
    ];

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Anti-Pattern Insights</h1>
            <ul className="space-y-4">
                {insights.map((insight) => (
                    <li key={insight.name} className="p-4 bg-gray-100 rounded shadow">
                        <h2 className="text-lg font-bold">{insight.name}</h2>
                        <p>Occurrences: {insight.count}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AntiPatternInsights;
