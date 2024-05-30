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
        },
        {
          trays: [
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x4" },
          ],
        },
        {
          trays: [
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x4" },
          ],
        },
        {
          trays: [
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x4" },
          ],
        },
        {
          trays: [
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x4" },
          ],
        },
        {
          trays: [
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
          ],
        },
        {
          trays: [
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
          ],
        },
        {
          trays: [
            { plants: [], size: "4x4" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
          ],
        },
        {
          trays: [
            { plants: [], size: "4x4" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
          ],
        },
        {
          trays: [
            { plants: [], size: "4x4" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
          ],
        },
      ],
      columns: 2,
    },
    Laboratory: {},
  },
  Hangar2: {
    Main_room:{rows: [
      {
        trays: [
          { plants: [], size: "4x8" },
          { plants: [], size: "4x8" },
        ],
      },
      {
        trays: [
          { plants: [], size: "4x8" },
          { plants: [], size: "4x8" },
        ],
      },
      {
        trays: [
          { plants: [], size: "4x8" },
          { plants: [], size: "4x8" },
        ],
      },
      {
        trays: [
          { plants: [], size: "4x8" },
          { plants: [], size: "4x8" },
        ],
      },
      {
        trays: [
          { plants: [], size: "4x8" },
          { plants: [], size: "4x8" },
        ],
      },
      {
        trays: [
          { plants: [], size: "4x8" },
          { plants: [], size: "4x8" },
        ],
      },
      {
        trays: [
          { plants: [], size: "4x8" },
          { plants: [], size: "4x8" },
        ],
      },
      {
        trays: [
          { plants: [], size: "4x8" },
          { plants: [], size: "4x8" },
        ],
      },
    ],
    columns: 2,},
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
        },
      ],
      columns: 1,
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
    plants.map((plant) => {
      if (!plant.currentAddress) return;
      if (plant.currentAddress.row < 6) {
        const row = plant.currentAddress.row - 1;
        const trayNum = 4 - plant.currentAddress?.tray;

        const tray = map[building][room].rows[row]?.trays[trayNum];
        tray?.plants.push(plant);
      } else {
        const row = 10 - plant.currentAddress.row + 5;
        const trayNum = plant.currentAddress?.tray - 1;

        const tray = map[building][room].rows[row]?.trays[trayNum];
        tray?.plants.push(plant);
      }
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
            width: "620px",
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            flex: "0 0 0",
          }}
        >
          {map[building][room].rows.map((row, index) => (
            <Row key={index} trays={row.trays} />
          ))}
        </Box>
      </Box>
    </Box>
  );
};
