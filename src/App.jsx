import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "@/lib/query-client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PageNotFound from "./lib/PageNotFound";
import Home from "./pages/Home";
import DensityExperiment from "./pages/DensityExperiment";
import CellDivisionExperiment from "./pages/CellDivisionExperiment";
import AtomicStructureExperiment from "./pages/AtomicStructureExperiment";
import PendulumExperiment from "./pages/PendulumExperiment";
import PressureExperiment from "./pages/PressureExperiment";
import CircuitExperiment from "./pages/CircuitExperiment";
import RefractionExperiment from "./pages/RefractionExperiment";
import ThermalExperiment from "./pages/ThermalExperiment";

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/experiment/density" element={<DensityExperiment />} />
          <Route path="/experiment/cell-division" element={<CellDivisionExperiment />} />
          <Route path="/experiment/atomic-structure" element={<AtomicStructureExperiment />} />
          <Route path="/experiment/pendulum" element={<PendulumExperiment />} />
          <Route path="/experiment/pressure" element={<PressureExperiment />} />
          <Route path="/experiment/circuits" element={<CircuitExperiment />} />
          <Route path="/experiment/refraction" element={<RefractionExperiment />} />
          <Route path="/experiment/thermal" element={<ThermalExperiment />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
