import {
  IconButton,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Alert,
  Box,
  Stack,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import PropTypes from "prop-types";
import {
  useAddElementToWaterMutation,
  useDeleteWaterElementMutation,
  useDeleteWaterMutation,
  useGetAllWatersQuery,
  useUpdateWaterElementMutation,
} from "../../store/feedingApi";
import {
  AddElementDialog,
  AddWaterDialog,
  EditConcentrationDialog,
} from "./Helpers";
import { useState } from "react";

function WaterCard({ water }) {
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState([]);
  const { name, disctiption, _id: id, elements } = water;
  const [deleteWaterElement ] = useDeleteWaterElementMutation();
  const [deleteWater] = useDeleteWaterMutation();
  const [addElement] = useAddElementToWaterMutation();
  const [updateElement] = useUpdateWaterElementMutation();
  const deleteHandler = () => {
    deleteWater(id);
  };
  const addElementHandler = (body) => {
    addElement({ id, body });
  };

  const openDialog = (index) => {
    setOpenEdit((prev) => {
      if (prev.length === 0) {
        return [true];
      }
      if (prev.length < index) {
        return [...prev, true];
      }
      if (prev.length === index) {
        return [...prev, true];
      }
      return prev.map((v, j) => (index === j ? true : v));
    });
  };

  const closeDialog = (index) => {
    setOpenEdit((prev) => {
      return prev.map((v, j) => (index === j ? false : v));
    });
  };
  return (
    <Card>
      <CardHeader title={name} />
      <CardContent>
        <Typography>{disctiption}</Typography>
        {elements?.length > 0 && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Element</TableCell>
                <TableCell>Concentration(%)</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {elements?.length > 0 &&
                elements.map((element, i) => (
                  <TableRow key={i}>
                    <TableCell>{element.form}</TableCell>
                    <TableCell>{element.concentration}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => {
                          openDialog(i);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          deleteWaterElement({ id, elementId: element._id });
                        }
                        }
                      >
                        <DeleteForeverIcon />
                      </IconButton>
                      <EditConcentrationDialog
                        open={openEdit[i]}
                        concentration={element.concentration}
                        onChange={(concentration) => {
                          updateElement({
                            id,
                            elementId: element._id,
                            body: { concentration },
                          });
                        }}
                        onClose={() => {
                          closeDialog(i);
                        }}
                      />

                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      <CardActions>
        <IconButton onClick={() => setOpen(true)}>
          <AddIcon />
        </IconButton>
        <IconButton onClick={deleteHandler}>
          <DeleteForeverIcon />
        </IconButton>
      </CardActions>
      <AddElementDialog
        open={open}
        onClose={() => setOpen(false)}
        onChange={(body) => {
          addElementHandler(body);
        }}
      />
    </Card>
  );
}

WaterCard.propTypes = {
  water: PropTypes.object.isRequired,
};

export default function WaterList() {
  const [open, setOpen] = useState(false);
  const {
    isLoading,
    isSuccess,
    isError,
    data: waters,
  } = useGetAllWatersQuery();
  return (
    <Box>
      {isLoading && <CircularProgress />}
      {isError && <Alert severity="error">Error</Alert>}
      {isSuccess && waters?.length > 0 && (
        <Stack
          direction="row"
          spacing={2}
          sx={{
            p: 0,
          }}
        >
          {waters.map((water) => (
            <WaterCard key={water._id} water={water} />
          ))}
        </Stack>
      )}
      <Button onClick={() => setOpen(true)}>Add Water</Button>
      <AddWaterDialog open={open} onClose={() => setOpen(false)} />
    </Box>
  );
}
