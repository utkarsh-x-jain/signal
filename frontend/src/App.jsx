import { BrowserRouter, Routes, Route } from "react-router-dom";

import Cursor from "./components/ui/Cursor";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import AssetDetails from "./pages/AssetDetails";

function App() {
  return (
    <BrowserRouter>
      <Cursor />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/asset/:assetId" element={<AssetDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;