import React, { useState } from "react";
import { Graph } from "react-d3-graph";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const ToggleSection = ({ title, severity, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const getSeverityStyle = (level) => {
        switch (level) {
            case "High":
                return "bg-red-500 text-white";
            case "Medium":
                return "bg-yellow-500 text-white";
            case "Low":
                return "bg-green-500 text-white";
            default:
                return "bg-gray-300 text-gray-700";
        }
    };

    return (
        <div className="bg-white border rounded shadow-md mb-4">
            <button
                className={`w-full text-left px-6 py-4 flex justify-between items-center text-lg font-semibold ${
                    isOpen ? "bg-gray-300" : "bg-gray-200"
                } hover:bg-gray-300`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{isOpen ? `Hide ${title}` : `Show ${title}`}</span>
                <span className="flex items-center space-x-2">
                    <span
                        className={`px-2 py-1 text-xs font-bold rounded ${getSeverityStyle(
                            severity
                        )}`}
                    >
                        {severity}
                    </span>
                    <span>{isOpen ? "▲" : "▼"}</span>
                </span>
            </button>
            {isOpen && <div className="p-6 bg-gray-50">{children}</div>}
        </div>
    );
};

const CyclicDependencyDetails = ({ data }) => {
    const graphConfig = {
        directed: true,
        nodeHighlightBehavior: true,
        node: {
            color: "#008080",
            size: 300,
            fontSize: 10,
            highlightStrokeColor: "blue",
        },
        link: {
            highlightColor: "#ADD8E6",
        },
        height: 300,
        width: "100%",
    };

    return (
        <>
            <p>
                <strong>Severity:</strong> {data.severity}
            </p>
            <p className="text-sm text-gray-600">
                Cyclic dependencies can lead to cascading failures, resource contention, and difficulties in service scaling.
            </p>
            <Graph id="cyclic-graph" data={data.graph} config={graphConfig} />
            <ul className="list-disc list-inside mt-4 space-y-2">
                <li>Refactor cyclic dependencies by introducing intermediary services.</li>
                <li>Consider using a message broker to decouple direct service calls.</li>
                <li>Perform architectural reviews to identify and prevent future cyclic dependencies.</li>
            </ul>
        </>
    );
};

const HighFanOutChart = ({ data }) => {
    const chartData = {
        labels: data.services.map((item) => item.service),
        datasets: [
            {
                label: "Fan-Out Count",
                data: data.services.map((item) => item.count),
                backgroundColor: "rgba(54, 162, 235, 0.6)",
            },
        ],
    };

    return (
        <>
            <p className="text-sm text-gray-600">
                High fan-out occurs when a single service communicates with too many downstream services, increasing complexity and potential failure points.
            </p>
            <div className="h-64">
                <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "top" } } }} />
            </div>
            <ul className="list-disc list-inside mt-4 space-y-2">
                <li>Reduce the number of downstream dependencies by merging or eliminating unnecessary calls.</li>
                <li>Implement caching or data aggregation to reduce direct dependency on downstream services.</li>
                <li>Introduce a dedicated service to handle common requests from multiple services.</li>
            </ul>
        </>
    );
};

const ExcessiveDependencyTable = ({ data }) => (
    <>
        <p className="text-sm text-gray-600">
            Excessive dependency indicates services that rely on a large number of other services, making them fragile and hard to maintain.
        </p>
        <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse border border-gray-300 mt-4 text-sm">
                <thead>
                <tr className="bg-gray-200 text-left">
                    <th className="border border-gray-300 px-4 py-2">Service</th>
                    <th className="border border-gray-300 px-4 py-2">Dependencies</th>
                </tr>
                </thead>
                <tbody>
                {data.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-100">
                        <td className="border border-gray-300 px-4 py-2">{item.service}</td>
                        <td className="border border-gray-300 px-4 py-2">{item.count}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
        <ul className="list-disc list-inside mt-4 space-y-2">
            <li>Identify critical dependencies and evaluate if they can be reduced.</li>
            <li>Introduce service abstractions or APIs to consolidate dependencies.</li>
            <li>Regularly review service dependencies to avoid unnecessary complexity.</li>
        </ul>
    </>
);

const ServiceBottleneckChart = ({ data }) => {
    const chartData = {
        labels: data.services.map((item) => item.service),
        datasets: [
            {
                label: "Request Rate",
                data: data.services.map((item) => item.requestRate),
                backgroundColor: "rgba(255, 99, 132, 0.6)",
            },
        ],
    };

    return (
        <>
            <p className="text-sm text-gray-600">
                Bottlenecks occur when a service cannot handle the volume of incoming requests, leading to delays and degraded performance.
            </p>
            <div className="h-64">
                <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "top" } } }} />
            </div>
            <ul className="list-disc list-inside mt-4 space-y-2">
                <li>Scale the bottleneck service horizontally or vertically to meet demand.</li>
                <li>Optimize resource usage through performance tuning and profiling.</li>
                <li>Distribute requests using load balancers to reduce the load on a single service.</li>
            </ul>
        </>
    );
};

const AntiPatternDetection = () => {
    const cyclicDependencyData = {
        severity: "High",
        graph: {
            nodes: [
                { id: "Service-A" },
                { id: "Service-B" },
                { id: "Service-C" },
            ],
            links: [
                { source: "Service-A", target: "Service-B" },
                { source: "Service-B", target: "Service-C" },
                { source: "Service-C", target: "Service-A" },
            ],
        },
    };

    const highFanOutData = {
        services: [
            { service: "Service-A", count: 12 },
            { service: "Service-B", count: 8 },
        ],
    };

    const excessiveDependencyData = [
        { service: "Service-A", count: 10 },
        { service: "Service-C", count: 9 },
    ];

    const bottleneckData = {
        services: [
            { service: "Service-B", requestRate: 120 },
            { service: "Service-D", requestRate: 95 },
        ],
    };

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">Anti-Pattern Detection</h1>
            <p>Run an analysis to detect anti-patterns in your system.</p>
            <button className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 mb-6">
                Run Detection
            </button>
            <ToggleSection title="Cyclic Dependency" severity="High">
                <CyclicDependencyDetails data={cyclicDependencyData} />
            </ToggleSection>
            <ToggleSection title="High Fan-Out" severity="Medium">
                <HighFanOutChart data={highFanOutData} />
            </ToggleSection>
            <ToggleSection title="Excessive Dependency" severity="Low">
                <ExcessiveDependencyTable data={excessiveDependencyData} />
            </ToggleSection>
            <ToggleSection title="Service Bottleneck" severity="Medium">
                <ServiceBottleneckChart data={bottleneckData} />
            </ToggleSection>
        </div>
    );
};

export default AntiPatternDetection;
