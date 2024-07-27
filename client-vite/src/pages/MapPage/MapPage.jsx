import { Box, Typography } from "@mui/material";
import { Row } from "./Row";
import { useGetMapQuery } from "../../store/plantsApi";
import { useParams } from "react-router-dom";
import { Rack } from "./Rack";

export const MapPage = () => {
  const building = useParams().building;
  const room = useParams().room;
  const roomName = room.split("_").join(" ");

  const { data:map, isLoading, isError, error } = useGetMapQuery(
    {
      refetchOnReconnect: true,
      refetchOnMountOrArgChange: true,
    }
  );

  // useEffect(() => {
  //   setPlants(() => []);
  //   map = { ...mapTemp };
  //   if (data) setPlants(() => [...data]);
  // }, [data]);

  // useEffect(() => {
  //   map = { ...mapTemp };
  //   if (plants) {
  //     if (room === "Laboratory") {
  //       const racks = map[building][room]?.racks;
  //       plants.map((plant) => {
  //         if (!plant.currentAddress) return;
  //         const rack = plant.currentAddress.rack - 1;
  //         let shelfNum =
  //           racks[rack]?.shelfs.length - plant.currentAddress?.shelf;
  //         const shelf = racks[rack]?.shelfs[shelfNum];
  //         shelf?.plants.push(plant);
  //       });
  //     } else {
  //       const rows = map[building][room]?.rows;
  //       plants.map((plant) => {
  //         if (!plant.currentAddress) return;
  //         const row = plant.currentAddress.row - 1;
  //         let trayNum;
  //         if (rows[row]?.numeration === "Up") {
  //           trayNum = rows[row].trays.length - plant.currentAddress?.tray;
  //         } else {
  //           trayNum = plant.currentAddress?.tray - 1;
  //         }
  //         const tray = rows[row]?.trays[trayNum];
  //         tray?.plants.push(plant);
  //       });
  //     }
  //   }
  // }, [plants, building, room]);
  if (isError) return <Box>Error: {error.message}</Box>;
  if (isLoading) return <Box>Loading...</Box>;

  return (
    <Box>
      <Typography variant="h1" component="h1" gutterBottom>
        Map Page
      </Typography>
      <Typography variant="h6" component="h6" gutterBottom>
        Total:{map?.totalPlants||"0"}plants
      </Typography>
      <Box>
        <Box
          sx={{
            width: map[building][room]?.width,
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            flex: "0 0 0",
            verticalAlign: "",
          }}
        >
          {Object.keys(map).length>0&&
            map[building][room]?.racks &&
            map[building][room].racks.map((rack, index) => (
              <Rack key={index} index={index} shelfs={rack.shelfs} />
            ))}
          {Object.keys(map).length>0&&
            map[building][room]?.rows &&
            map[building][room].rows.map((row, index) => (
              <Row
                key={index}
                index={index}
                trays={row.trays}
                direction={row.numeration}
              />
            ))}
        </Box>
      </Box>
    </Box>
  );
};
