import { Route, Routes } from 'react-router-dom';
import NotFound from "@/pages/NotFound.jsx";
import { AntiPatternDetection, AntiPatternInsights, TraceExplorer, SystemArchitecture, Settings } from "@/pages";
import { WeightedGraphViewer } from "@/pages";

const AnimatedRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<AntiPatternDetection />} />
            <Route path="/anti-patterns" element={<AntiPatternDetection />} />
            <Route path="/insights" element={<AntiPatternInsights />} />
            <Route path="/trace-explorer" element={<TraceExplorer />} />
            <Route path="/system-architecture" element={<SystemArchitecture />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/weighted-graph" element={<WeightedGraphViewer />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AnimatedRoutes;
