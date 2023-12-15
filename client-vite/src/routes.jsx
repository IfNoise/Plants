import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { ClonersPage } from "./pages/ClonersPage/ClonersPage";
import { MothersPage } from "./pages/MothersPage/MothersPage";
import { PlantsPage } from "./pages/PlantsPage";
import { SeedsPage} from "./pages/SeedsPage";
import { Layout } from "./pages/Layout";
import { PlantDetailPage } from "./pages/PlantDetailPage/PlantDetailPage";
import { AuthPage } from "./pages/AuthPage";


export const Router = createBrowserRouter(
  createRoutesFromElements(
    <>
    <Route path="/" element={<Layout />}>
      <Route index element={<PlantsPage />} />
      
      <Route path="seeds" element={<SeedsPage />} />


      <Route path="cloners" element={<ClonersPage />} />

      <Route path="mothers" element={<MothersPage />} />

      <Route path="plants" element={<PlantsPage />} />

      <Route path="plant/:id" element={<PlantDetailPage />} />
      
      
    </Route>
     <Route path="/auth" element={<AuthPage />} />
    </>
  )
);
