import {
  Box,
  Typography,
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

export default function NutrientCalculator() {
  const [tab, setTab] = useState(0);
  const appBar = useContext(AppBarContext);
  useEffect(() => {
    appBar.setAppBar({ title: "Nutrient Calculator" });
  }, []);
  return (
    <Box>
      <Typography variant="h4">Nutrient Calculator</Typography>
      <Tabs
        sx={{
          position: "sticky",
          top: 0,
        }}
        value={tab}
        onChange={(e, value) => setTab(value)}
      >
        <Tab label="Fertilizers" value={0} />
        <Tab label="Concentrates" value={1} />
        <Tab label="Fertigation Units" value={2} />
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
    </Box>  
  );
}
