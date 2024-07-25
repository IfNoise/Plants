import { Box, Typography } from "@mui/material";
import { Row } from "./Row";
import { useGetPlantsQuery } from "../../store/plantsApi";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Rack } from "./Rack";

const map = {
  Hangar1: {
    Main_room: {
      width:`650px`,
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
    Laboratory: {
      width:"100%",
      racks:[
        {
          shelfs:[
            {
              plants:[]
            },
            {
              plants:[]
            },
            {
              plants:[]
            }
          ]
        },
        {
          shelfs:[
            {
              plants:[]
            },
            {
              plants:[]
            },
            {
              plants:[]
            },
            {
              plants:[]
            }
          ]
        },
        {
          shelfs:[
            {
              plants:[]
            },
            {
              plants:[]
            },
            {
              plants:[]
            },
            {
              plants:[]
            }
          ]
        },
        {
          shelfs:[
            {
              plants:[]
            },
            {
              plants:[]
            },
            {
              plants:[]
            },
            {
              plants:[]
            },
            {
              plants:[]
            }
          ]
        },
        {
          shelfs:[
            {
              plants:[]
            },
            {
              plants:[]
            },
            {
              plants:[]
            },
            {
              plants:[]
            },
            {
              plants:[]
            },
          ]
        },
        {
          shelfs:[
            {
              plants:[]
            },
            {
              plants:[]
            },
            {
              plants:[]
            }
          ]
        },
        {
          shelfs:[
            {
              plants:[]
            },
            {
              plants:[]
            },
            {
              plants:[]
            },
          ]
        },
        {
          shelfs:[
            {
              plants:[]
            },
            {
              plants:[]
            },
            {
              plants:[]
            },
          ]
        },
        {
          shelfs:[
            {
              plants:[]
            },
            {
              plants:[]
            },
            {
              plants:[]
            },
          ]
        }
      ],
      rows:[
        {
          trays:[
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x4" },
          ],
          numeration: "Up",

        }
      ]
    },
  },
  Hangar2: {
    Main_room: {
      width:`780px`,
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
      width:`390px`,
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
  const [plants, setPlants] = useState(null); //[{}
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
      if(plants)return
      if(data)setPlants(()=>data);
  }, [data]);
  useEffect(() => {
    if(plants){if(room==="Laboratory"){
    const racks = map[building][room]?.racks;
    plants.map((plant) => {
      if (!plant.currentAddress) return;
      const rack = plant.currentAddress.rack - 1;
      let shelfNum= racks[rack]?.shelfs.length - plant.currentAddress?.shelf;
      const shelf = racks[rack]?.shelfs[shelfNum];
      shelf?.plants.push(plant);
    })}else{
      const rows = map[building][room]?.rows;
      plants.map((plant) => {
        if (!plant.currentAddress) return;
        const row = plant.currentAddress.row - 1;
        let trayNum;
        if (rows[row]?.numeration === "Up") {
          trayNum = rows[row].trays.length - plant.currentAddress?.tray;
        } else {
          trayNum = plant.currentAddress?.tray - 1;
        }
        const tray = rows[row]?.trays[trayNum];
        tray?.plants.push(plant);
      });
    }}
  }
  , [plants,building,room]);
  const totalPlants = plants?.length||0;
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
            width: map[building][room]?.width,
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            flex: "0 0 0",
            verticalAlign:""

          }}
        >
          {data&&map[building][room]?.racks && map[building][room].racks.map((rack, index) => (
            <Rack key={index} index={index} shelfs={rack.shelfs} />
          ))}
          {data&&map[building][room]?.rows &&  map[building][room].rows.map((row, index) => (
            <Row key={index} index={index} trays={row.trays} direction={row.numeration} />
          ))}
        </Box>
      </Box>
    </Box>
  );
};
