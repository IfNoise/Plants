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
import { stringToColor } from "../../utilites/color";

export const MapPage = () => {
  const appBar = useContext(AppBarContext);
  const isSmall = window.innerWidth < 600;
  const building = useParams().building;
  const room = useParams().room;
  const roomName = room.split("_").join(" ");
  const getOrientation = (threshold = 1) =>
    window.innerWidth / window.innerHeight < threshold
      ? "vertical"
      : "horizontal";
  const orientation = useMemo(() => getOrientation(2.3), []);
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
  const [rows, setRows] = useState([]);

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

  useEffect(() => {
    if (map && map[building] && map[building][room]) {
      setRows(
        orientation === "horizontal"
          ? map[building][room].rows.toReversed()
          : map[building][room].rows
      );
    }
  }, [map, building, room, orientation]);

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
          rows.map((row, index) => (
            <Row
              key={index}
              index={index}
              trays={row.trays}
              direction={row.numeration}
              address={{ building, room }}
              orientation={orientation}
            />
          ))}
      </Box>
      {data?.length > 0 && (
        <>
          <Dialog
            open={open}
            onClose={handleClose}
            width="100%"
            maxWidth={isSmall ? "md" : "lg"}
            fullWidth
            fullScreen={isSmall}
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
                          outerRadius: isSmall ? 70 : 200,
                          data,
                          arcLabel: (d) => `${d.label}`,
                          arcLabelMinAngle: isSmall ? 20 : 10,
                          arcLabelRadius: isSmall ? 70 : 100,
                        },
                      ]}
                      height={isSmall ? 450 : 500}
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
