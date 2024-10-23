import { useState } from "react";
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
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
import {
  AddElementDialog,
  Ballance,
  NewFertilizerDialog,
  NPK,
} from "./Helpers";
import { EditConcentrationDialog, ContentTable } from "./Helpers";

import {
  useAddElementMutation,
  useCreateFertilizerMutation,
  useDeleteFertilizerMutation,
  useDeleteElementMutation,
  useGetAllFertilizersQuery,
  useUpdateElementMutation,
} from "../../store/feedingApi";
import ExpandMore from "@mui/icons-material/ExpandMore";

const FertilizerCard = ({ fertilizer }) => {
  const [addElement] = useAddElementMutation();
  const [updateElement] = useUpdateElementMutation();
  const [deleteElement] = useDeleteElementMutation();
  const [deleteFertilizer] = useDeleteFertilizerMutation();
  const deleteFertilizerHandler = (id) => {
    deleteFertilizer(id);
  };
  const {
    name,
    description,
    elements,
    _id: id,
    content,
    aniones,
    kationes,
  } = fertilizer;
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(() => {
    return Array(elements.length).fill(false);
  });

  const openDialog = (index) => {
    setOpenEdit((prev) => {
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
      <CardHeader
        title={
          <>
            {name}
            <NPK content={elements} />
          </>
        }
      />

      <CardContent>
        <Typography variant="h6">{description}</Typography>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography>Elements</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Table
              size="small"
              sx={{
                width: "auto",
              }}
            >
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
                        <IconButton
                          onClick={() => {
                            deleteElement({ id, elementId: element._id });
                          }}
                        >
                          <DeleteForeverIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </AccordionDetails>
          <AccordionActions>
            <Button onClick={() => setOpen(true)}>Add Element</Button>
          </AccordionActions>
        </Accordion>
        {content?.length > 0 && <ContentTable content={content} />}
        {aniones && kationes && (
          <Ballance aniones={aniones} kationes={kationes} />
        )}
      </CardContent>
      <CardActions>
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
            addElement({ id, body: element });
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

  const [createFertilizer] = useCreateFertilizerMutation();

  if (isLoading) {
    return <CircularProgress />;
  }
  if (isError) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return (
    <Box>
      <Stack direction="column" spacing={1}>
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
