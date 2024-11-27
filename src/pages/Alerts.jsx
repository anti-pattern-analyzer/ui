import React from "react";

const Alerts = () => {
    const alerts = [
        { id: 1, message: "High latency detected in Service-A" },
        { id: 2, message: "Service-B exceeded call threshold" },
    ];

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Alerts</h1>
            <ul className="space-y-4">
                {alerts.map((alert) => (
                    <li key={alert.id} className="bg-red-100 p-4 rounded shadow">
                        {alert.message}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Alerts;
