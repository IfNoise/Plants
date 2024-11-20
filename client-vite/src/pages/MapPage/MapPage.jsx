import {
  Box,
  Link,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
} from "@mui/material";
import { Row } from "./Row";
import { useGetMapQuery } from "../../store/plantsApi";
import { useParams } from "react-router-dom";
import { Rack } from "./Rack";
import { useContext, useEffect, useMemo, useState } from "react";
import { AppBarContext } from "../../context/AppBarContext";

import { PieChart } from "@mui/x-charts";
function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = ((hash >> (i * 8)) + 75) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

export const MapPage = () => {
  const appBar = useContext(AppBarContext);
  const building = useParams().building;
  const room = useParams().room;
  const roomName = room.split("_").join(" ");
  const params = new URLSearchParams({ building, room: roomName }).toString();
  const {
    data: map,
    isLoading,
    isError,
    error,
  } = useGetMapQuery({
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: true,
  });

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const calculatePlants = (map) => {
    const plantCount = {};

    if (map && map[building] && map[building][room]) {
      const racks = map[building][room].racks || [];
      const rows = map[building][room].rows || [];
      racks.forEach((rack) => {
        rack.shelfs.forEach((shelf) => {
          shelf.plants.forEach((plant) => {
            const key = `${plant.pheno}`;
            plantCount[key] = (plantCount[key] || 0) + 1;
          });
        });
      });

      rows.forEach((row) => {
        row.trays.forEach((tray) => {
          tray.plants.forEach((plant) => {
            const key = `${plant.pheno}`;
            plantCount[key] = (plantCount[key] || 0) + 1;
          });
        });
      });
    }
    return Object.keys(plantCount)
      .map((key) => ({
        label: key,
        value: plantCount[key],
        color: stringToColor(key),
      }))
      .sort((a, b) => b.value - a.value);
  };

  const data = useMemo(() => {
    if (!map) return [];
    return calculatePlants(map);
  }, [map, building, room]);
  useEffect(() => {
    appBar.setAppBar({ title: "Map" });
  }, []);

  if (isError) return <Box>Error: {error.message}</Box>;
  if (isLoading) return <Box>Loading...</Box>;

  return (
    <Box>
      <Typography variant="h4" component="h4" gutterBottom>
        {building}.{roomName}
      </Typography>
      <Link
        sx={{
          fontSize: "18px",
          fontWeight: "bold",
        }}
        href={`/plants?${params}`}
      >
        Total:{map[building][room].totalPlants || "0"}plants
      </Link>

      <Link
        display={"block"}
        sx={{
          fontSize: "18px",
          fontWeight: "bold",
        }}
        href="#"
        onClick={handleClickOpen}
      >
        Stat
      </Link>
      <Box
        sx={{
          width: map[building][room]?.width,
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "baseline",
          alignContent: "space-around",
          flexDirection: "row",
          flexWrap: "wrap",
          flex: "0 0 0",
        }}
      >
        {Object.keys(map).length > 0 &&
          map[building][room]?.racks &&
          map[building][room].racks.map((rack, index) => (
            <Rack
              key={index}
              index={index}
              shelfs={rack.shelfs}
              address={{ building, room }}
            />
          ))}
        {Object.keys(map).length > 0 &&
          map[building][room]?.rows &&
          map[building][room].rows.map((row, index) => (
            <Row
              key={index}
              index={index}
              trays={row.trays}
              direction={row.numeration}
              address={{ building, room }}
            />
          ))}
      </Box>
      {data?.length > 0 && (
        <>
          <Dialog
            open={open}
            onClose={handleClose}
            width="100%"
            maxWidth="lg"
            fullWidth
          >
            <DialogTitle>Pie Chart</DialogTitle>
            <DialogContent>
              {data?.length > 0 && (
                <Grid container spacing={2}>
                  <Grid item xs={12} md={2}>
                    <TableContainer component={Paper}>
                      <Table size="small" width="auto">
                        <TableHead>
                          <TableRow>
                            <TableCell>Pheno</TableCell>
                            <TableCell>Number</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {data.map((row, index) => (
                            <TableRow key={index}>
                              <TableCell>{row.label}</TableCell>
                              <TableCell>{row.value} pcs.</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                  <Grid item xs={12} md={10}>
                    <PieChart
                      series={[
                        {
                          outerRadius: 200,
                          data,
                          highlightScope: { highlight: "item", fade: "global" },
                          faded: {
                            innerRadius: 30,
                            additionalRadius: 30,
                            color: "gray",
                          },
                          arcLabel: (d) => `${d.label}`,
                          arcLabelMinAngle: 10,
                        },
                      ]}
                      height="400"
                    />
                  </Grid>
                </Grid>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Box>
  );
};
