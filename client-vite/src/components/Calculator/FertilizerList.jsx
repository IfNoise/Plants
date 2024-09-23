import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { AddElementDialog, NewFertilizerDialog } from "./Helpers";
import { EditConcentrationDialog,ContentTable } from "./Helpers";

import {
  useAddElementMutation,
  useCreateFertilizerMutation,
  useDeleteFertilizerMutation,
  useDeleteElementMutation,
  useGetAllFertilizersQuery,
  useUpdateElementMutation,
} from "../../store/feedingApi";

const FertilizerCard = ({ fertilizer }) => {
  const [addElement] =
    useAddElementMutation();
  const [
    updateElement
  ] = useUpdateElementMutation();
  const [
    deleteElement
  ] = useDeleteElementMutation();
  const [deleteFertilizer] = useDeleteFertilizerMutation();
  const deleteFertilizerHandler = (id) => {
    deleteFertilizer(id);
  };

  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState([]);

  const { name, description, elements, _id: id,content } = fertilizer;

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
        <Typography variant="h6">{description}</Typography>
        <Table size="small">
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
                  <TableCell>{element.name}</TableCell>
                  <TableCell>{element.concentration}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => {
                        openDialog(i);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <EditConcentrationDialog
                      open={openEdit[i]}
                      concentration={element.concentration}
                      onChange={(concentration) => {
                        updateElement({id, elementId:element._id, body: { concentration }});
                      }}
                      onClose={() => {
                        closeDialog(i);
                      }}
                    />
                    <IconButton
                      onClick={() => {
                        deleteElement({id, elementId:element._id});
                      }}
                    >
                      <DeleteForeverIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        {content?.length>0 && <ContentTable content={content} />}
      </CardContent>
      <CardActions>
        <Button onClick={() => setOpen(true)}>Add Element</Button>
        <Button
          onClick={() => {
            deleteFertilizerHandler(id);
          }}
        >
          Delete
        </Button>
        <AddElementDialog
          open={open}
          onClose={() => setOpen(false)}
          onChange={(element) => {
            console.log(element); 
            addElement({id,body: element});
            setOpen(false);
          }}
        />
      </CardActions>
    </Card>
  );
};
FertilizerCard.propTypes = {
  fertilizer: PropTypes.string.isRequired,
};

const FertilizerList = () => {
  const [open, setOpen] = useState(false);
  const {
    isLoading,
    isError,
    data: fertilizers,
    error,
  } = useGetAllFertilizersQuery();

  const [
    createFertilizer
  ] = useCreateFertilizerMutation();

  if (isLoading) {
    return <CircularProgress />;
  }
  if (isError) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return (
    <Box>
      <Stack direction="column" margin={2} spacing={2} justifyContent="center">
        {fertilizers?.length > 0 &&
          fertilizers.map((fertilizer) => (
            <FertilizerCard key={fertilizer.name} fertilizer={fertilizer} />
          ))}
      </Stack>
      <Button
        onClick={() => {
          setOpen(true);
        }}
      >
        Add Fertilizer
      </Button>
      <NewFertilizerDialog
        open={open}
        onClose={() => setOpen(false)}
        onChange={(fertilizer) => {
          createFertilizer(fertilizer);
          setOpen(false);
        }}
      />
    </Box>
  );
};

export default FertilizerList;
