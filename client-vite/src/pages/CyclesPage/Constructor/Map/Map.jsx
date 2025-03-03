import {
  Box,
  Link,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";
import { Row } from "./Row";
import {
  useGetEmptyMapQuery,
  useSaveMapMutation,
} from "../../../../store/plantsApi";
import { Rack } from "./Rack";
import { useContext, useEffect, useMemo, useState } from "react";
import { buildRooms } from "../../../../config/config";
//import { PieChart } from "@mui/x-charts";
import { MapContext } from "../../../../context/MapContext";
//import { stringToColor } from "../../../../utilites/color";

const LoadMapDialog = ({ onChange = () => {} }) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (data && onChange) onChange(() => data);
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      };
      reader.readAsText(file);
    }
  };
  return (
    <>
      <input
        accept="application/json"
        id="file"
        type="file"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      <label htmlFor="file">
        <Button variant="contained" component="span">
          Load
        </Button>
      </label>
    </>
  );
};

export default function Map() {
  const mapContext = useContext(MapContext);
  const [saveMap] = useSaveMapMutation();
  //const isSmall = window.innerWidth < 600;
  const [building, setBuilding] = useState("");
  const [room, setRoom] = useState("");
  const [roomName, setRoomName] = useState([]);
  const [rooms, setRooms] = useState([]);
  const lodash = (a) => a.split(" ").join("_");
  const getOrientation = (threshold = 1) =>
    window.innerWidth / window.innerHeight < threshold
      ? "vertical"
      : "horizontal";
  const orientation = useMemo(() => getOrientation(2.3), []);
  const {
    data: map,
    isLoading,
    isError,
    error,
  } = useGetEmptyMapQuery({
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: true,
  });

  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (map && map[building] && map[building][room]) {
      console.log("Map is loaded:", map);
      mapContext.setMap(() => {
        const { rows, racks } = map[building][room];
        const newMap = {
          [building]: {
            [room]: {
              rows: rows || [],
              racks: racks || [],
            },
          },
        };
        console.log("New Map:", newMap);
        return newMap;
      });
    }
  }, [map, building, room]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  // const handleClose = () => {
  //   setOpen(false);
  // };
  const handlerBuilding = (e) => {
    const { value } = e.target;
    setBuilding(value);
    setRooms(() => [...buildRooms[value]]);
  };
  const logMap = () => {
    console.log(mapContext.map);
  };
  const handleSaveMap = () => {
    // 1. Преобразование данных в JSON
    const jsonData = JSON.stringify(mapContext.ma);

    // 2. Создание Blob-объекта
    const blob = new Blob([jsonData], { type: "application/json" });

    // 3. Создание ссылки для скачивания
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "mapData.json";

    // 4. Имитация клика по ссылке
    document.body.appendChild(link);
    link.click();

    // Очистка
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlerRoom = (e) => {
    const { value } = e.target;
    setRoomName(value);
    setRoom(lodash(value));
  };

  if (isError) return <Box>Error: {error.message}</Box>;
  if (isLoading) return <Box>Loading...</Box>;

  return (
    <Box>
      <Stack direction="row" spacing={1}>
        <FormControl variant="outlined" sx={{ m: "2px", width: "95%" }}>
          <InputLabel id="building-label">Building</InputLabel>
          <Select
            labelId="building-label"
            value={building ?? ""}
            name="building"
            label="Building"
            onChange={handlerBuilding}
          >
            {Object.keys(buildRooms).map((obj, index) => {
              return (
                <MenuItem key={index} value={obj}>
                  {obj}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <Button onClick={() => handleSaveMap()}>Save</Button>
        <LoadMapDialog
          onChange={(e) => {
            setBuilding(Object.keys(e)[0]);
            setRoom(Object.keys(e[Object.keys(e)[0]])[0]);
            mapContext.setMap(e);
          }}
        />
      </Stack>
      <Stack direction="row" spacing={1}>
        <FormControl variant="outlined" sx={{ m: "2px", width: "95%" }}>
          <InputLabel id="room-label">Room</InputLabel>
          <Select
            labelId="room-label"
            name="room"
            value={roomName ?? ""}
            label="Room"
            onChange={handlerRoom}
          >
            {rooms.map((text, index) => {
              return (
                <MenuItem key={index} value={text}>
                  {text}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Stack>
      <Button onClick={logMap}>Log Map</Button>
      <Typography variant="h4" component="h4" gutterBottom>
        {building}.{room}
      </Typography>
      <Typography
        sx={{
          fontSize: "18px",
          fontWeight: "bold",
        }}
      >
        {/* Total:{map[building][room].totalPlants || "0"}plants */}
      </Typography>

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
      {building && room && mapContext.map && (
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
          {mapContext.map[building][room]?.racks?.length > 0 &&
            mapContext.map[building][room]?.racks?.map((rack, index) => (
              <Rack
                key={index}
                shelfs={rack.shelfs}
                address={{ building, room, rack: index + 1 }}
              />
            ))}
          {mapContext.map[building][room]?.rows.length > 0 &&
            mapContext.map[building][room]?.rows.map((row, index) => (
              <Row
                key={index}
                direction={row.numeration}
                address={{ building, room, row: index + 1 }}
                orientation={orientation}
              />
            ))}
        </Box>
      )}
      {/* {data && (
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
      )} */}
    </Box>
  );
}
