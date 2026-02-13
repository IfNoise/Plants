import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { ClonersPage } from "./pages/ClonersPage/ClonersPage";
import { MothersPage } from "./pages/MothersPage/MothersPage";
import { PlantsPage } from "./pages/PlantsPage";
import { StrainsPage} from "./pages/StrainsPage";
import { StrainDetailPage} from "./pages/StrainDetailPage";
import { Layout } from "./pages/Layout";
import { PlantDetailPage } from "./pages/PlantDetailPage/PlantDetailPage";
import { AuthPage } from "./pages/AuthPage";
import { TrayPage } from "./pages/TrayPage";
import CyclesPage from "./pages/CyclesPage/CyclesPage";
import Dashboard from "./pages/Dashboard/Dashboard";
import { MapPage } from "./pages/MapPage/MapPage";
import { GalleryPage } from "./pages/GalleryPage";
import NutrientCalculator from "./pages/NutrientCalculator/NutrientCalculator";
import DeviceFilesPage from "./pages/DeviceFilesPage";


export const Router = createBrowserRouter(
  createRoutesFromElements(
    <>
    <Route path="/" element={<Layout />}>
      <Route index element={<PlantsPage />} />
      
      <Route path="strains" element={<StrainsPage />} />

      <Route path="cycles" element={<CyclesPage />} />

      <Route path="cloners" element={<ClonersPage />} />

      <Route path="mothers" element={<MothersPage />} />

      <Route path="plants" element={<PlantsPage />} />

      <Route path="tray" element={<TrayPage />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="plant/:id" element={<PlantDetailPage />} />
      <Route path="map/:building/:room" element={<MapPage />} />
      <Route path="strain/:id" element={<StrainDetailPage />} />
      <Route path="gallery" element={<GalleryPage />} />
      <Route path="nutrients" element={<NutrientCalculator />} />
      <Route path="device-files" element={<DeviceFilesPage />} />


      
    </Route>
    <Route path="auth" element={<AuthPage />} /> 
    </>
  )
);
