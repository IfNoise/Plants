import { Box, Link, Paper, Stack} from "@mui/material";
import PropTypes from "prop-types";
import MiniPlant from "./MiniPlant";
export default function Shelf({index,plants,address}) {
  const height =100;
  const width = 200
  const plantCount = plants.length;
  const shelf = index+1;
  const { building, room,rack } = address;
  const params = new URLSearchParams({ building, room, rack, shelf }).toString();
  return (
    <Paper
      sx={{
        width,
        height,
        margin: 1,
      }}
    >
      <Paper
        sx={{
          p:"1px",
          m:"3px",
          height:"25px",
          contentAlign:"center",

        }}
      >
            <Link
          href={`/plants?${params}`}
          sx={{
            fontSize: "14px",
            fontWeight: "bold",
            color: "black",
          }}
        >
      {plantCount}plants
        </Link>
      </Paper>
      <Stack direction="row" useFlexGap flexWrap="wrap" spacing={0.2} margin="1px"
      sx={{
        overflowY:"scroll",
      }}
      >
      {plants?.map((plant,i) => (
        <MiniPlant key={i} plant={plant} />
      ))}
      </Stack>
    </Paper>
  );
}
Shelf.propTypes = {
  plants: PropTypes.array,
};
