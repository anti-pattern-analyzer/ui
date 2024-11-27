import { Route, Routes } from 'react-router-dom';
import TraceExplorer from "@/pages/TraceExplorer.jsx";
import CompareTraces from "@/pages/CompareTraces.jsx";
import SystemArchitecture from "@/pages/SystemArchitecture.jsx";
import Reports from "@/pages/Reports.jsx";
import Alerts from "@/pages/Alerts.jsx";
import Monitor from "@/pages/Monitor.jsx";
import NotFound from "@/pages/NotFound.jsx";
import Settings from "@/pages/Settings.jsx";
import AntiPatternInsights from "@/pages/AntiPatternInsights.jsx";
import AntiPatternDetection from "@/pages/AntiPatternDetection.jsx";

const AnimatedRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<AntiPatternDetection />} />
            <Route path="/anti-patterns" element={<AntiPatternDetection />} />
            <Route path="/insights" element={<AntiPatternInsights />} />
            <Route path="/trace-explorer" element={<TraceExplorer />} />
            <Route path="/compare-traces" element={<CompareTraces />} />
            <Route path="/system-architecture" element={<SystemArchitecture />} />
            <Route path="/monitor" element={<Monitor />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AnimatedRoutes;
