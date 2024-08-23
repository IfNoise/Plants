import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
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
} from '@mui/material';
import {addConcentrate, addToConcentrate,addFertilizer,addConcentrateToUnit,addFertilizerUnit} from '../../store/nutrientsSlice';
import PropTypes from 'prop-types';
import { elements } from "../../config/config";

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

export function AddConcentrateDialog({ open, onClose }){
  const [newConcentrate, setNewConcentrate] = useState(null);
  const dispatch = useDispatch();
  const handleAddConcentrate = () => {
    if (newConcentrate) {
      dispatch(addConcentrate(newConcentrate));
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

export function AddFertilizerDialog({ open, concentrate, onClose }){
  const fertilizers = useSelector((state) => state.nutrients.fertilizers);
  const [fertilizer, setFertilizer] = useState(null);
  const dispatch = useDispatch();
  const handleAddFertilizer = () => {
    if (fertilizer) {
      dispatch(addToConcentrate({ name: concentrate, fertilizer }));
      setFertilizer(null);
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
          <Select
            value={fertilizer}
            onChange={(e) =>
              setFertilizer({ ...fertilizer, name: e.target.value })
            }
          >
            <MenuItem value={null}>None</MenuItem>
            {fertilizers.map((f, i) => (
              <MenuItem key={i} value={f.name}>
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
          <Button onClick={handleAddFertilizer}>Add Fertilizer</Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
AddFertilizerDialog.propTypes = {
  open: PropTypes.bool,
  concentrate: PropTypes.string,
  onClose: PropTypes.func,
};

export function EditConcentrationDialog({
  open,
  concentration,
  onChange,
  onClose,
}){
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
          <Button
            onClick={handleEditConcentration}
          >
            Save
          </Button>
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

export function AddElementDialog({ open, onChange, onClose }){
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

export function NewFertilizerDialog({ open, onClose }){
  const [newFertilizer, setNewFertilizer] = useState(null);
  const dispatch = useDispatch();

  const handleAddFertilizer = () => {
    if (newFertilizer) {
      dispatch(addFertilizer({ ...newFertilizer, content: [] }));
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
};

export function AddConcentrateToUnitDialog({ open,unit, onClose }){ 
  const [concentrate, setConcentrate] = useState(null);
  const concentrates = useSelector((state) => state.nutrients.concentrates);
  const dispatch = useDispatch();
  const handleAddConcentrate = () => {
    if (concentrate) {
      dispatch(addConcentrateToUnit({unit,concentrate:concentrate.name}));
    }
    setConcentrate(null);
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Concentrate</DialogTitle>
      <DialogContent>
        <Box>
          <Select
            value={concentrate}
            onChange={(e) =>
              setConcentrate({ ...concentrate, name: e.target.value })
            }
          >
            {concentrates.map((c, i) => (
              <MenuItem key={i} value={c.name}>
                {c.name}
              </MenuItem>
            ))}
          </Select>
          <pre>{JSON.stringify(concentrate, null, 2)}</pre>
          
          <Button onClick={handleAddConcentrate}>Add Concentrate</Button>
          <Button onClick={onClose}>Close</Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
AddConcentrateToUnitDialog.propTypes = {
  open: PropTypes.bool,
  unit: PropTypes.string,
  onClose: PropTypes.func,
};


export function AddFertigationUnitDialog({ open, onClose }){
  const [newUnit, setNewUnit] = useState(null);
  const dispatch = useDispatch();
  const handleAddUnit = () => {
    if (newUnit) {
      dispatch(addFertilizerUnit({...newUnit,concentrates:[],pumps:[]}));
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
            onChange={(e) =>
              setNewUnit({ ...newUnit, name: e.target.value })
            }
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