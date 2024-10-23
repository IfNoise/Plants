import {
  Box,
  Tab,
  Tabs,
} from "@mui/material";
import { useEffect, useState } from "react";
import { CustomTabPanel} from "../../components/Calculator/Helpers";
import FertilizerList from "../../components/Calculator/FertilizerList";
import ConcentrateList from "../../components/Calculator/ConcentrateList";
import FertigationUnitList from "../../components/Calculator/UnitList";
import { AppBarContext } from "../../context/AppBarContext";
import { useContext } from "react";
import RecipeList from "../../components/Calculator/RecipeList";
import WaterList from "../../components/Calculator/WaterList";

export default function NutrientCalculator() {
  const [tab, setTab] = useState(0);
  const appBar = useContext(AppBarContext);
  useEffect(() => {
    appBar.setAppBar({ title: "Nutrient Calculator" });
  }, []);
  return (
    <Box
    >
      <Tabs
        sx={{
          maxWidth: "100vw",
          m: 0,
          p: 0,
        }}
        variant="scrollable"
        scrollButtons="auto"
        value={tab}
        onChange={(e, value) => setTab(value)}
      >
        <Tab label="Fertilizers" value={0} />
        <Tab label="Concentrates" value={1} />
        <Tab label="Fertigation Units" value={2} />
        <Tab label="Recipes" value={3} />
        <Tab label="Waters" value={4} />
      </Tabs>
      <CustomTabPanel value={tab} index={0}>
        <FertilizerList />
      </CustomTabPanel>
      <CustomTabPanel value={tab} index={1}>
        <ConcentrateList />
      </CustomTabPanel>
      <CustomTabPanel value={tab} index={2}>
        <FertigationUnitList />
      </CustomTabPanel>
      <CustomTabPanel value={tab} index={3}>
        <RecipeList />
      </CustomTabPanel>
      <CustomTabPanel value={tab} index={4}>
        <WaterList />
      </CustomTabPanel>
    </Box>  
  );
}
