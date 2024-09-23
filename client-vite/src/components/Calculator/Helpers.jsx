import { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  TextField,
  Typography,
  List,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Stack,
} from "@mui/material";
import PropTypes from "prop-types";
import { elements } from "../../config/config";
import {
  useAddFertilizerMutation,
  useAddPumpToFertilizerUnitMutation,
  useCreateConcentrateMutation,
  useCreateFertilizerUnitMutation,
  useGetAllConcentratesQuery,
  useGetAllFertilizersQuery,
} from "../../store/feedingApi";

export function ContentTable({ content }) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Element</TableCell>
          <TableCell>Concentration</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {content.map((c, i) => (
          <TableRow key={i}>
            <TableCell>{c.element}</TableCell>
            <TableCell>{c.concentration}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
ContentTable.propTypes = {
  content: PropTypes.array,
};

export function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      height="80%"
      overflow="auto"
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}
CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

export function AddConcentrateDialog({ open, onClose }) {
  const [newConcentrate, setNewConcentrate] = useState(null);
  const [createConcentrate] = useCreateConcentrateMutation();
  const handleAddConcentrate = () => {
    if (newConcentrate) {
      createConcentrate(newConcentrate);
      setNewConcentrate(null);
      if (onClose) {
        onClose();
      }
    }
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Concentrate</DialogTitle>
      <DialogContent>
        <Box>
          <TextField
            label="Name"
            value={newConcentrate?.name}
            onChange={(e) =>
              setNewConcentrate({ ...newConcentrate, name: e.target.value })
            }
          />
          <TextField
            label="Description"
            value={newConcentrate?.description}
            onChange={(e) =>
              setNewConcentrate({
                ...newConcentrate,
                description: e.target.value,
                content: [],
              })
            }
          />
          <Button onClick={handleAddConcentrate}>Add Concentrate</Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
AddConcentrateDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

export function AddFertilizerDialog({ open, concentrateId, onClose }) {
  const { data: fertilizers } = useGetAllFertilizersQuery();
  const [addFertilizer] = useAddFertilizerMutation();
  const [fertilizer, setFertilizer] = useState(null);
  const handleAddFertilizer = () => {
    if (fertilizer?.concentration && fertilizer?.id) {
      addFertilizer({
        id: concentrateId,
        body: {
          fertilizer: fertilizer.id,
          concentration: fertilizer.concentration,
        },
      });
      setFertilizer(null);
      if (onClose) {
        onClose();
      }
    } else {
      alert("Please select a fertilizer and set the concentration");
    }
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Fertilizer</DialogTitle>
      <DialogContent>
        <Box>
          <Select
            sx={{ width: "100%" }}
            value={fertilizer}
            renderValue={(value) => {
              if (!value) {
                return "Select Fertilizer";
              }
              return fertilizers.find((f) => f._id === value)?.name;
            }}
            onChange={(e) =>
              setFertilizer({ ...fertilizer, id: e.target.value })
            }
          >
            <MenuItem value={null}>None</MenuItem>
            {fertilizers?.length > 0 &&
              fertilizers.map((f, i) => (
                <MenuItem key={i} value={f._id}>
                  {f.name}
                </MenuItem>
              ))}
          </Select>
          <TextField
            label="Concentration g/L"
            type="number"
            min={0}
            max={1000}
            onChange={(e) =>
              setFertilizer({
                ...fertilizer,
                concentration: parseFloat(e.target.value),
              })
            }
          />
          <Button
            disabled={!fertilizer?.id || !fertilizer?.concentration}
            onClick={handleAddFertilizer}
          >
            Add Fertilizer
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
AddFertilizerDialog.propTypes = {
  open: PropTypes.bool,
  concentrateId: PropTypes.string.isRequired,
  onClose: PropTypes.func,
};

export function EditConcentrationDialog({
  open,
  concentration,
  onChange,
  onClose,
}) {
  const [newConcentration, setNewConcentration] = useState(concentration);
  const handleEditConcentration = () => {
    if (newConcentration) {
      onChange(newConcentration);
      if (onClose) {
        onClose();
      }
    }
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Concentration</DialogTitle>
      <DialogContent>
        <Box>
          <TextField
            label="Concentration"
            type="number"
            min={0}
            max={1000}
            value={newConcentration}
            onChange={(e) => setNewConcentration(parseFloat(e.target.value))}
          />
          <Button onClick={handleEditConcentration}>Save</Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
EditConcentrationDialog.propTypes = {
  open: PropTypes.bool,
  concentration: PropTypes.number,
  onChange: PropTypes.func,
  onClose: PropTypes.func,
};

export function AddElementDialog({ open, onChange, onClose }) {
  const [newElement, setNewElement] = useState(null);

  const handleAddElement = () => {
    if (newElement && newElement.name && newElement.concentration) {
      onChange(newElement);
      setNewElement(null);
    }
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Element</DialogTitle>
      <DialogContent>
        <Box>
          <List>
            {elements.map(
              (element) =>
                element.content.length > 0 &&
                element.content.map((content, j) => (
                  <MenuItem
                    key={j}
                    onClick={() =>
                      setNewElement({ ...newElement, name: content.element })
                    }
                  >
                    {element.name} - {content.element}
                  </MenuItem>
                ))
            )}
          </List>
          <Typography variant="body"> {newElement?.name}</Typography>
          <TextField
            label="Concentration"
            type="number"
            min={0}
            max={100}
            step={0.1}
            value={newElement?.concentration}
            onChange={(e) =>
              setNewElement({
                ...newElement,
                concentration: parseFloat(e.target.value),
              })
            }
          />
          <pre>{JSON.stringify(newElement, null, 2)}</pre>
          <Button onClick={handleAddElement}>Add Element</Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
AddElementDialog.propTypes = {
  open: PropTypes.bool,
  onChange: PropTypes.func,
  onClose: PropTypes.func,
};

export function NewFertilizerDialog({ open, onChange, onClose }) {
  const [newFertilizer, setNewFertilizer] = useState(null);

  const handleAddFertilizer = () => {
    if (newFertilizer) {
      onChange(newFertilizer);
      setNewFertilizer(null);
      if (onClose) {
        onClose();
      }
    }
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Fertilizer</DialogTitle>
      <DialogContent>
        <Box>
          <TextField
            label="Name"
            value={newFertilizer?.name}
            onChange={(e) =>
              setNewFertilizer({ ...newFertilizer, name: e.target.value })
            }
          />
          <TextField
            label="Description"
            value={newFertilizer?.description}
            onChange={(e) =>
              setNewFertilizer({
                ...newFertilizer,
                description: e.target.value,
              })
            }
          />

          <Button
            disabled={!newFertilizer?.name || !newFertilizer?.description}
            onClick={handleAddFertilizer}
          >
            Add Fertilizer
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
NewFertilizerDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onChange: PropTypes.func,
};

export function AddPumpToUnitDialog({ open, unit, onClose }) {
  const [pump, setPump] = useState({
    name: "",
    description: "",
    minFlowRate: 0.4,
    maxFlowRate: 4.0,
    concentrate: null,
    flowRate: 0.4,
    factor: 1.0,
  });
  const [addPumpToUnitDialog]=useAddPumpToFertilizerUnitMutation()
  const { data: concentrates } = useGetAllConcentratesQuery();
  const handleAddPump = () => {
    if (pump?.name) {
      addPumpToUnitDialog({id:unit,body:pump})
      if (onClose) {
        onClose();
      }
    }
    setPump(null);
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Concentrate</DialogTitle>
      <DialogContent>
        <Box>
          {concentrates?.length>0 && <Select
            value={pump?.concentrate|| ""}
            renderValue={(value) => {
              if (!value) {
                return "Select Concentrate";
              }
              return concentrates.find((c) => c._id === value)?.name; 
            }}
            onChange={(e) => setPump({ ...pump, concentrate: e.target.value })}
          >
            {concentrates.map((c, i) => (
              <MenuItem key={i} value={c._id}>
                {c.name}
              </MenuItem>
            ))}
          </Select>}
          <Stack direction="column" spacing={1}>
          <TextField
            label="Name"
            value={pump?.name}
            onChange={(e) => setPump({ ...pump, name: e.target.value })}
          />
          <TextField
            label="Description"
            value={pump?.description}
            onChange={(e) => setPump({ ...pump, description: e.target.value })}
          />
          <TextField
            label="Min Flow Rate"
            type="number"
            value={pump?.minFlowRate}
            onChange={(e) =>
              setPump({ ...pump, minFlowRate: parseFloat(e.target.value) })
            }
          />
          <TextField
            label="Max Flow Rate"
            type="number"
            value={pump?.maxFlowRate}
            onChange={(e) =>
              setPump({ ...pump, maxFlowRate: parseFloat(e.target.value) })
            }
          />
          <Select
            value={pump?.factor}
            onChange={(e) =>
              setPump({ ...pump, factor: parseFloat(e.target.value) })
            }
          >
            {[
              { factor: 1.0, name: "1x" },
              { factor: 0.5, name: "1/2x" },
              { factor: 0.33, name: "1/3x" },
              { factor: 0.25, name: "1/4x" },
              { factor: 0.2, name: "1/5x" },
              { factor: 0.1, name: "1/10x" },
            ].map((c, i) => (
              <MenuItem key={i} value={c.factor}>
                {c.name}
              </MenuItem>
            ))}
          </Select>

          <Button onClick={handleAddPump}>Add Pump</Button>
          <Button onClick={onClose}>Close</Button>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
AddPumpToUnitDialog.propTypes = {
  open: PropTypes.bool,
  unit: PropTypes.string,
  onClose: PropTypes.func,
};

export function AddFertigationUnitDialog({ open, onClose }) {
  const [newUnit, setNewUnit] = useState(null);
  const [createUnit] = useCreateFertilizerUnitMutation();
  const handleAddUnit = () => {
    if (newUnit) {
      createUnit(newUnit);
      setNewUnit(null);
      if (onClose) {
        onClose();
      }
    }
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Fertilizer Unit</DialogTitle>
      <DialogContent>
        <Box>
          <TextField
            label="Name"
            value={newUnit?.name}
            onChange={(e) => setNewUnit({ ...newUnit, name: e.target.value })}
          />
          <TextField
            label="Description"
            value={newUnit?.description}
            onChange={(e) =>
              setNewUnit({ ...newUnit, description: e.target.value })
            }
          />
          <Button onClick={handleAddUnit}>Add Fertigation Unit</Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
AddFertigationUnitDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};
