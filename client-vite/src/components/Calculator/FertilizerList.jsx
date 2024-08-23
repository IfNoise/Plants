import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { AddElementDialog, AddFertilizerDialog, NewFertilizerDialog } from './Helpers';
import { EditConcentrationDialog } from './Helpers';
import { addElement, editElement, removeElement,addFertilizer } from '../../store/nutrientsSlice';



const FertilizerCard = ({ fertilizer }) => {
  const fertilizers = useSelector((state) => state.nutrients.fertilizers);
  const [open, setOpen] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState([]);
  const dispatch = useDispatch();
  if (!fertilizer) {
    return null;
  }
  if (!fertilizers.find((n) => n.name === fertilizer)) return null;

  const { name, description, content } = fertilizers.find(
    (n) => n.name === fertilizer
  );
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
    <Card >
      <CardHeader title={name} />

      <CardContent>
        <Typography variant="h6">{description}</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Element</TableCell>
              <TableCell>Concentration(%)</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {content?.length > 0 &&
              content.map((element, i) => (
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
                        dispatch(
                          editElement({
                            name,
                            element: element.name,
                            concentration,
                          })
                        );
                      }}
                      onClose={() => {
                        closeDialog(i);
                      }}
                    />
                    <IconButton
                      onClick={() => {
                        dispatch(
                          removeElement({ name, element: element.name })
                        );
                      }}
                    >
                      <DeleteForeverIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardActions>
        <Button onClick={() => setOpen(true)}>Add Element</Button>
        <AddElementDialog
          open={open}
          onClose={() => setOpen(false)}
          onChange={(element) => {
            dispatch(addElement({ name, element }));
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
  const fertilizers = useSelector((state) => state.nutrients.fertilizers);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  return (
    <Box 

    >
      <Stack
      direction="column"
      margin={2}
      spacing={2}
      justifyContent="center"
      >
      {fertilizers?.length > 0 &&
        fertilizers.map((fertilizer) => (
          <FertilizerCard key={fertilizer.name} fertilizer={fertilizer.name} />
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
          dispatch(addFertilizer(fertilizer));
          setOpen(false);
        }}
      />
    </Box>
  );
}

export default FertilizerList;