import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Mapview } from "./pages/Mapview";

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Mapview />} />
      </Routes>
    </BrowserRouter>
  );
};
