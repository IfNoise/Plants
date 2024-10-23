import { useState, useMemo } from "react";
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Card,
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
  TextField,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import {
  AddConcentrateDialog,
  AddFertilizerDialog,
  Ballance,
  ContentTable,
  EditConcentrationDialog,
} from "./Helpers";
import {
  useDeleteConcentrateMutation,
  useDeleteFertilizerFromConcMutation,
  useGetAllConcentratesQuery,
  useGetAllFertilizersQuery,
  useUpdateFertilizerMutation,
} from "../../store/feedingApi";

const ConcentrateCard = ({ concentrate }) => {
  const {
    _id: id,
    name,
    description,
    content,
    fertilizers,
    aniones,
    kationes,
  } = concentrate;
  const { data: fertilizerList = [] } = useGetAllFertilizersQuery();
  const [deleteConcentrate] = useDeleteConcentrateMutation();
  const [deleteFertilizerFromConc] = useDeleteFertilizerFromConcMutation();
  const [updateFertilizer] = useUpdateFertilizerMutation();
  const [volume, setVolume] = useState(1);

  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(() => {
    return Array(fertilizers.length).fill(false);
  });

  const [elementsList, setElementsList] = useState([]);
  const openDialog = (index) => {
    setOpenEdit((prev) => {
      return prev.map((v, j) => (index === j ? true : v));
    });
  };

  const handleEdit = (elementId, concentration) => {
    updateFertilizer({
      id,
      elementId,
      body: { concentration },
    });
  };

  const closeDialog = (index) => {
    setOpenEdit((prev) => {
      return prev.map((v, j) => (index === j ? false : v));
    });
  };
  const deleteConcentrateHandler = (id) => {
    deleteConcentrate(id);
  };
  useMemo(() => {
    if (fertilizers?.length === 0 || fertilizerList?.length === 0) return;

    const ferts = fertilizers
      .map((fert) => {
        const fertilizer = fertilizerList.find(
          (f) => f._id === fert.fertilizer
        );
        if (!fertilizer) return null;
        return {
          _id: fert._id,
          name: fertilizer.name,
          concentration: fert.concentration,
        };
      })
      .filter((f) => f !== null);

    setElementsList(ferts);
  }, [fertilizers, fertilizerList]);

  return (
    <Card>
      <CardHeader
        variant="h4"
        title={
          <TextField
            size="small"
            label="Volume"
            type="number"
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
          />
        }
        avatar={<Typography variant="h2">{name}</Typography>}
      />
      <CardContent>
        <Typography variant="h6">{description}</Typography>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
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
                  <TableCell>Nutrient</TableCell>
                  <TableCell>Mass per 1L</TableCell>
                  <TableCell>Mass per {volume}L</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {elementsList?.length > 0 &&
                  elementsList.map((element, i) => (
                    <TableRow key={i}>
                      <TableCell>{element.name}</TableCell>
                      <TableCell>{element.concentration}g</TableCell>
                      <TableCell>
                        {(element.concentration * volume).toFixed(2)}g
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => {
                            openDialog(i);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <EditConcentrationDialog
                          open={openEdit[i] || false}
                          concentration={element.concentration}
                          onChange={(concentration) => {
                            handleEdit(element._id, concentration);
                          }}
                          onClose={() => closeDialog(i)}
                        />

                        <IconButton
                          onClick={() =>
                            deleteFertilizerFromConc({
                              id,
                              elementId: element._id,
                            })
                          }
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
            <Button onClick={() => setOpen(true)}>Add Fertilizer</Button>
          </AccordionActions>
        </Accordion>

        {content?.length > 0 && <ContentTable content={content} />}
        {aniones && kationes && (
          <Ballance aniones={aniones / 1000} kationes={kationes / 1000} />
        )}

        <AddFertilizerDialog
          open={open}
          onClose={() => setOpen(false)}
          concentrateId={id}
        />
        <Button onClick={() => deleteConcentrateHandler(id)}>Delete</Button>
      </CardContent>
    </Card>
  );
};
ConcentrateCard.propTypes = {
  concentrate: PropTypes.string.isRequired,
};

export default function ConcentrateList() {
  const {
    isLoading,
    isError,
    error,
    data: concentrates,
  } = useGetAllConcentratesQuery();
  const [open, setOpen] = useState(false);
  if (isLoading) return <CircularProgress />;
  if (isError) return <Alert severity="error">{error.message}</Alert>;
  return (
    <Box>
      <Stack direction="column" spacing={2}>
        {concentrates.map((concentrate, i) => (
          <ConcentrateCard key={i} concentrate={concentrate} />
        ))}
      </Stack>
      <Button
        onClick={() => {
          setOpen(true);
        }}
      >
        Add Concentrate
      </Button>
      <AddConcentrateDialog open={open} onClose={() => setOpen(false)} />
    </Box>
  );
}
