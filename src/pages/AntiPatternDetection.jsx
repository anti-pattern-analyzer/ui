import React from "react";

const AntiPatternDetection = () => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Anti-Pattern Detection</h1>
            <div className="space-y-4">
                <p>Run an analysis to detect anti-patterns in your system.</p>
                <button className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600">
                    Run Detection
                </button>
                <div className="bg-gray-100 p-4 rounded shadow">
                    <h2 className="text-lg font-bold">Detected Anti-Patterns</h2>
                    <ul className="list-disc list-inside">
                        <li>High Fan-Out: Service-A 12 services</li>
                        <li>Excessive Service Dependency: Service-B</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AntiPatternDetection;
