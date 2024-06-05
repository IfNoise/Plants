import { Box, Typography } from "@mui/material";
import { Row } from "./Row";
import { useGetPlantsQuery } from "../../store/plantsApi";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const map = {
  Hangar1: {
    Main_room: {
      rows: [
        {
          trays: [
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x4" },
          ],
          numeration: "Up",
        },
        {
          trays: [
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x4" },
          ],
          numeration: "Up",
        },
        {
          trays: [
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x4" },
          ],
          numeration: "Up",
        },
        {
          trays: [
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x4" },
          ],
          numeration: "Up",
        },
        {
          trays: [
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x4" },
          ],
          numeration: "Up",
        },
        {
          trays: [
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
          ],
          numeration: "Down",
        },
        {
          trays: [
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
          ],
          numeration: "Down",
        },
        {
          trays: [
            { plants: [], size: "4x4" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
          ],
          numeration: "Down",
        },
        {
          trays: [
            { plants: [], size: "4x4" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
          ],
          numeration: "Down",
        },
        {
          trays: [
            { plants: [], size: "4x4" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
          ],
          numeration: "Down",
        },
      ],
      columns: 5,
    },
    Laboratory: {},
  },
  Hangar2: {
    Main_room: {
      rows: [
        {
          trays: [
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
          ],
          numeration: "Up",
        },
        {
          trays: [
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" }
          ],
          numeration: "Up",
        },
        {
          trays: [
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" }
          ],
          numeration: "Up",
        },
        {
          trays: [
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" }
          ],
          numeration: "Up",
        },
        {
          trays: [
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" }
          ],
          numeration: "Up",
        },
        {
          trays: [
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" }
          ],
          numeration: "Up",
        },
        {
          trays: [
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x4" }
          ],
          numeration: "Down",
        },
        {
          trays: [
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x4" }
          ],
          numeration: "Down",
        },
        {
          trays: [
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },

          ],
          numeration: "Down",
        },
      ],
      columns: 6,
    },
    Small_Room: {
      rows: [
        {
          trays: [
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x4" },
          ],
          numeration: "Down",
        },
        {
          trays: [
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
          ],
          numeration: "Down",
        },
        {
          trays: [
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
          ],
          numeration: "Down",
        },
      ],
      columns: 3,
    },
  },
};
export const MapPage = () => {
  const building = useParams().building;
  const room = useParams().room;
  const roomName = room.split("_").join(" ");
  const [plants, setPlants] = useState([{}]); //[{}
  const { data, isLoading, isError, error } = useGetPlantsQuery(
    {
      "currentAddress.building": building,
      "currentAddress.room": roomName,
    },
    {
      refetchOnReconnect: true,
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
    }
  );
  useEffect(() => {
    if (data) {
      setPlants(data);
    }
  }, [data]);
  useEffect(() => {
    const rows = map[building][room]?.rows;
    plants.map((plant) => {
      if (!plant.currentAddress) return;

      const row = plant.currentAddress.row - 1;
      let trayNum;
      if (rows[row].numeration === "Up") {
        trayNum = rows[row].trays.length - plant.currentAddress?.tray;
      } else {
        trayNum = plant.currentAddress?.tray - 1;
      }
      const tray = rows[row]?.trays[trayNum];
      tray?.plants.push(plant);
    });
  }, [plants]);
  const totalPlants = plants.length;
  if (isError) return <Box>Error: {error.message}</Box>;
  if (isLoading) return <Box>Loading...</Box>;

  return (
    <Box>
      <Typography variant="h1" component="h1" gutterBottom>
        Map Page
      </Typography>
      <Typography variant="h6" component="h6" gutterBottom>
        Total:{totalPlants}plants
      </Typography>
      <Box>
        <Box
          sx={{
            width: `${map[building][room].columns * 130}px`,
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            flex: "0 0 0",
          }}
        >
          {map[building][room].rows.map((row, index) => (
            <Row key={index} index={index} trays={row.trays} direction={row.numeration} />
          ))}
        </Box>
      </Box>
    </Box>
  );
};
