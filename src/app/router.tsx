import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Brief } from "@/pages/Brief";
import { CarsPage } from "@/features/cars/pages/CarsPage";

/**
 * Add routes for your own pages here. `/` is the brief; you are free to move
 * it to `/brief` and put your work on `/`.
 */
export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Brief />} />
      <Route path="/cars" element={<CarsPage />} />
    </Routes>
  </BrowserRouter>
);
