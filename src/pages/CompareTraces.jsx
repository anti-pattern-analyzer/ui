import React from "react";

const CompareTraces = () => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Compare Traces</h1>
            <div className="space-y-4">
                <p>Select two traces to compare their details:</p>
                <div className="flex space-x-4">
                    <select className="px-4 py-2 border rounded">
                        <option>Trace-1</option>
                        <option>Trace-2</option>
                    </select>
                    <select className="px-4 py-2 border rounded">
                        <option>Trace-3</option>
                        <option>Trace-4</option>
                    </select>
                </div>
                <button className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600">
                    Compare
                </button>
            </div>
        </div>
    );
};

export default CompareTraces;
