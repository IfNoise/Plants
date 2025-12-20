import {
  Box,
  Link,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
} from "@mui/material";
import PropTypes from "prop-types";
import { Row } from "./Row";
import { useGetMapQuery } from "../../store/plantsApi";
import { useParams } from "react-router-dom";
import { Rack } from "./Rack";
import { useContext, useEffect, useMemo, useRef, useState, useCallback } from "react";
import { AppBarContext } from "../../context/AppBarContext";

import { PieChart } from "@mui/x-charts";
import { stringToColor } from "../../utilites/color";
import { useReactToPrint } from "react-to-print";
import { Scaler } from "../../components/Scaler";
const PrintOnly = ({ children }) => {
  return <div className="print-only">{children}</div>;
};
PrintOnly.propTypes = {
  children: PropTypes.node,
};

const PlantsStat = ({ plants }) => {
  const isSmall = window.innerWidth < 600;
  const data = useMemo(() => {
    if (!plants?.length) return [];
    
    const phenoMap = new Map();
    plants.forEach((plant) => {
      const key = plant.pheno;
      if (phenoMap.has(key)) {
        phenoMap.get(key).value += 1;
      } else {
        phenoMap.set(key, {
          label: `${plant.strain}-${plant.pheno}`,
          pheno: plant.pheno,
          value: 1,
          color: stringToColor(plant.pheno),
        });
      }
    });
    
    return Array.from(phenoMap.values()).sort((a, b) => b.value - a.value);
  }, [plants]);

  return (
    <>
      {data?.length === 0 && <Typography>No plants</Typography>}
      {data?.length > 0 && (
        <PieChart
          series={[
            {
              outerRadius: isSmall ? 70 : 150,
              data,
              radius: isSmall ? 70 : 200,
              arcLabel: (d) => `${d.pheno}`,
              arcLabelMinAngle: isSmall ? 20 : 10,
              arcLabelRadius: isSmall ? 70 : 100,
              cy: isSmall ? 30 : 150,
            },
          ]}
          slotProps={{
            legend: {
              direction: "column",
              position: { vertical: "top", horizontal: "right" },
              padding: 0,
              labelStyle: {
                fontSize: 12,
                fontWeight: "bold",
                fill: "black",
              },
            },
          }}
          sx={{
            padding: "10px",
            margin: "10px",
          }}
          width={isSmall ? 450 : 600}
          height={isSmall ? 450 : 400}
        />
      )}
    </>
  );
};
PlantsStat.propTypes = {
  plants: PropTypes.array,
};

export const MapPage = () => {
  const appBar = useContext(AppBarContext);
  const componentRef = useRef(null);

  const isSmall = window.innerWidth < 600;
  const building = useParams().building;
  const room = useParams().room;
  const roomName = room.split("_").join(" ");
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Map ${building}.${roomName}`,
  });
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
  const [orientation, setOrientation] = useState("vertical");
  const [pageWidth, setPageWidth] = useState(0);
  const [pageHeight, setPageHeight] = useState(0);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  
  const calculatePlants = useCallback((map) => {
    let plantCount = [];

    if (map && map[building] && map[building][room]) {
      const racks = map[building][room]?.racks || [];
      const rows = map[building][room]?.rows || [];
      if (racks?.length > 0) {
        racks.forEach((rack) => {
          rack.shelfs.forEach((shelf) => {
            shelf.plants.forEach((plant) => {
              plantCount.push(plant);
            });
          });
        });
      }
      if (rows?.length > 0) {
        rows.forEach((row) => {
          row.trays.forEach((tray) => {
            tray.plants.forEach((plant) => {
              plantCount.push(plant);
            });
          });
        });
      }

      return plantCount;
    }
    return [];
  }, [building, room]);

  const data = useMemo(() => {
    if (!map) return [];
    return calculatePlants(map);
  }, [map, calculatePlants]);

  useEffect(() => {
    if (!map?.[building]?.[room]) return;

    const roomData = map[building][room];
    const { columns, width, rows: roomRows } = roomData;
    const trayLengths = roomRows
      .map((row) => row.trays.length)
      .sort((a, b) => b - a); // Сортировка по убыванию

    let maxWidth = 0;
    let maxHeight = 0;

    if (orientation === "vertical") {
      setRows(roomRows);
      maxWidth = Math.max(width, 500);
      maxHeight = trayLengths.length / columns > 1 
        ? (trayLengths[0] + trayLengths[1]) * 64 
        : trayLengths[0] * 64;
    } else {
      setRows([...roomRows].reverse());
      maxWidth = columns * 150;
      maxHeight = columns * 70;
    }

    setPageWidth(maxWidth / 1.8 + 150);
    setPageHeight(maxHeight + 100);
  }, [map, building, room, orientation]);

  useEffect(() => {
    appBar.setAppBar({ title: "Map" });
  }, [appBar]);

  if (isError) return (
    <Box sx={{ p: 2 }}>
      <Typography color="error" variant="h6">
        Error loading map: {error?.message || 'Unknown error'}
      </Typography>
    </Box>
  );
  
  if (isLoading) return (
    <Box sx={{ p: 2 }}>
      <Typography>Loading...</Typography>
    </Box>
  );

  if (!map?.[building]?.[room]) return (
    <Box sx={{ p: 2 }}>
      <Typography>No map data available for {building}.{roomName}</Typography>
    </Box>
  );

  const currentRoom = map[building][room];

  return (
    <Box>
      <Typography variant="h4" component="h4" gutterBottom>
        {building}.{roomName}
      </Typography>
      <Select
        label="Orientation"
        value={orientation}
        onChange={(e) => setOrientation(e.target.value)}
      >
        <MenuItem value="horizontal">Horizontal</MenuItem>
        <MenuItem value="vertical">Vertical</MenuItem>
      </Select>
      <Link
        sx={{
          fontSize: "18px",
          fontWeight: "bold",
        }}
        href={`/plants?${params}`}
      >
        Total:{currentRoom.totalPlants || "0"}plants
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
      <Button onClick={handlePrint}>Print</Button>
      <Scaler max={1.2}>
        <Box ref={componentRef}>
          <style type="text/css" media="print">
            {" "}
            {`
            @page { size: ${pageWidth}mm ${pageHeight}mm ;
            padding: 15mm; }
            @media print {
  .print-only {
    display: block !important;
  }
  }

    .print-only {
  display: none;
  }
            `}{" "}
          </style>
          <PrintOnly>
            <Typography
              variant="h2"
              color={"black"}
            >{`${building}.${roomName}`}</Typography>
          </PrintOnly>
          <PrintOnly>
            {data?.length > 0 && <PlantsStat plants={data} />}
          </PrintOnly>
          <Box
            sx={{
              width:
                orientation === "vertical" ? currentRoom.width : "auto",
              height:
                orientation === "vertical"
                  ? "auto"
                  : currentRoom.columns * 150 + "px",
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "baseline",
              alignContent: "space-around",
              flexDirection: orientation === "vertical" ? "row" : "column",
              flexWrap: "wrap",
              flex: "0 0 0",
            }}
          >
            {currentRoom.racks?.length > 0 &&
              currentRoom.racks.map((rack, index) => (
                <Rack
                  key={index}
                  index={index}
                  shelfs={rack.shelfs}
                  address={{ building, room }}
                />
              ))}
            {rows.length > 0 &&
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
        </Box>
      </Scaler>
      {data?.length > 0 && (
        <>
          <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            width={isSmall ? "100%" : "md"}
            fullScreen={isSmall}
            fullWidth
          >
            <DialogTitle>Pie Chart</DialogTitle>
            <DialogContent>
              {data?.length > 0 && <PlantsStat plants={data} />}
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
