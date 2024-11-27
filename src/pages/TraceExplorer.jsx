import React from "react";

const TraceExplorer = () => {
    const traces = [
        { id: "Trace-1", service: "Service-A", duration: "123ms" },
        { id: "Trace-2", service: "Service-B", duration: "98ms" },
    ];

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Trace Explorer</h1>
            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                <tr>
                    <th className="border px-4 py-2">Trace ID</th>
                    <th className="border px-4 py-2">Service</th>
                    <th className="border px-4 py-2">Duration</th>
                </tr>
                </thead>
                <tbody>
                {traces.map((trace) => (
                    <tr key={trace.id}>
                        <td className="border px-4 py-2">{trace.id}</td>
                        <td className="border px-4 py-2">{trace.service}</td>
                        <td className="border px-4 py-2">{trace.duration}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default TraceExplorer;
