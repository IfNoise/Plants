import { Box, Link, Typography } from "@mui/material";
import { Row } from "./Row";
import { useGetMapQuery } from "../../store/plantsApi";
import { useParams } from "react-router-dom";
import { Rack } from "./Rack";

export const MapPage = () => {
  const building = useParams().building;
  const room = useParams().room;
  const roomName = room.split("_").join(" ");
  const params = new URLSearchParams({building, room:roomName}).toString();

  const { data:map, isLoading, isError, error } = useGetMapQuery(
    {
      refetchOnReconnect: true,
      refetchOnMountOrArgChange: true,
    }
  );

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
        Total:{map[building][room].totalPlants||"0"}plants
        </Link>
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
