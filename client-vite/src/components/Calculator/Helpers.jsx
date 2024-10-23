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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Stack,
  Divider,
} from "@mui/material";
import PropTypes from "prop-types";
import { elements } from "../../config/config";
import {
  useAddFertilizerMutation,
  useAddPumpToFertilizerUnitMutation,
  useCreateConcentrateMutation,
  useCreateFertilizerUnitMutation,
  useCreateRecieptMutation,
  useCreateWaterMutation,
  useGetAllConcentratesQuery,
  useGetAllFertilizersQuery,
  useGetAllRecieptsQuery,
  useGetAllWatersQuery,
  useUpdateRecieptMutation,
} from "../../store/feedingApi";

export function ContentTable({ content }) {
  return (
    <Table 
      size="small"
      sx={{
        width: "auto"
      }}
    >
      <TableHead>
        <TableRow>
          {content.map((c, i) => (
            <TableCell key={i}>{c.element}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          {content.map((c, i) => (
            <TableCell key={i}>{c.concentration.toFixed(1)}</TableCell>
          ))}
        </TableRow>
      </TableBody>
    </Table>
  );
}
ContentTable.propTypes = {
  content: PropTypes.array,
};

export function Ballance({kationes,aniones}){

  return (
    <Box
    >
    <Typography
      variant="body"
      color="#ffa7eb"
      fontFamily={"revert"}
      fontWeight={"bold"}
      component={"div"}
    >
      Kationes:+{kationes.toFixed(1)}
    </Typography>
    <Typography
      variant="body"
      color="#a7ebff"
      fontFamily={"revert"}
      fontWeight={"bold"}
      component={"div"}
    >
      Aniones:-{aniones.toFixed(1)}
    </Typography>
    <Typography
      variant="h5"
      color="#a7ffeb"
      fontFamily={"revert"}
      fontWeight={"bold"}
      component={"div"}
    >
      Ballance:{kationes>aniones?"+":""}{`   `}{(kationes-aniones).toFixed(1)}
    </Typography>
    </Box>
  )
}
Ballance.propTypes = {
  kationes: PropTypes.number,
  aniones: PropTypes.number,
};

export function RecipeTable({ content,recipe:recipeProp }) {
  const {name,description,_id:id,__v,...ingridients} = recipeProp;
  const recipe = Object.entries(ingridients).map(([element,concentration])=>({element,concentration}));
  return (
    <Table size="small" sx={{ width: "auto" }}>
      <TableHead>
        <TableRow>
          <TableCell>Element</TableCell>
          {recipe.map((r, i) => (
            <TableCell key={i}>{r.element}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>Recipe ppm/g</TableCell>
          {recipe.map((r, i) => (
            <TableCell key={i}>{r.concentration.toFixed(1)}</TableCell>
          ))}
        </TableRow>
        <TableRow>
          <TableCell>Actual ppm/g</TableCell>
          {recipe.map((r, i) => {
            const actualContent = content.find((c) => c.element === r.element) || { concentration: 0 };
            const actualConcentration = actualContent.concentration;
            const isMismatch = Math.abs(actualConcentration - r.concentration) > (r.concentration * 0.1);
            return (
              <TableCell key={i} sx={{ color: isMismatch ? "red" : "lime" }}>
                {actualConcentration.toFixed(1)}
              </TableCell>
            );
          })}
        </TableRow>
      </TableBody>
    </Table>
  );
}
RecipeTable.propTypes = {
  content: PropTypes.array,
  recipe: PropTypes.array,
};

export function NPK({content}){
  const n=content.find(c=>c.name==="Nitrogen")?.concentration||0;
  const p=content.find(c=>c.name==="Phosphorus")?.concentration||0;
  const k=content.find(c=>c.name==="Potassium")?.concentration||0;
  const mg=content.find(c=>c.name==="Magnesium")?.concentration||0;
  return (
    <Typography
      variant="h4"
      color="#a7ffeb"
      fontFamily={"revert"}
      fontWeight={"bold"}
    >
      {"  "}{n.toFixed(n% 1 === 0?0:1)}-{p.toFixed(p% 1 === 0?0:1)}-{k.toFixed(k% 1 === 0?0:1)}+{mg.toFixed(mg% 1 === 0?0:1)}
    </Typography>
  )
}
NPK.propTypes = {
  content: PropTypes.array,
};

export function SelectRecipe({onChange}){
  const { data: recipes } = useGetAllRecieptsQuery();
  return (
    <Select
      label="Recipe"
      onChange={(e) => onChange(recipes.find(r=>r._id===e.target.value))}
    >
      {recipes?.length > 0 &&
        recipes.map((r, i) => (
          <MenuItem key={i} value={r._id}>
            {r.name}
          </MenuItem>
        ))}
    </Select>
  );
}
SelectRecipe.propTypes = {
  onChange: PropTypes.func,
};

export function SelectWater({onChange}){
  const { data: waters } = useGetAllWatersQuery();
  return (
    <Select
      label="Water"
      onChange={(e) => onChange(waters.find(w=>w._id===e.target.value))}
    >
      {waters?.length > 0 &&
        waters.map((w, i) => (
          <MenuItem key={i} value={w._id}>
            {w.name}
          </MenuItem>
        ))}
    </Select>
  );
}
SelectWater.propTypes = {
  onChange: PropTypes.func,
};


export function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box 
      >{children}</Box>}
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
    if (
      newElement &&
      newElement.name &&
      newElement.form &&
      newElement.concentration
    ) {
      onChange(newElement);
      setNewElement(null);
    }
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Element</DialogTitle>
      <DialogContent>
        <Stack direction="column" spacing={1}>
          <Select
            label="Element"
            width="100%"
            onChange={(e) =>
              setNewElement({ ...newElement, name: e.target.value })
            }
          >
            {elements.map((element, i) => (
              <MenuItem key={i} value={element.name}>
                {element.name}
              </MenuItem>
            ))}
          </Select>
          <Select
            label="Form"
            width="100%"
            value={newElement?.form || ""}
            onChange={(e) =>
              setNewElement({ ...newElement, form: e.target.value })
            }
          >
            {newElement?.name &&
              elements
                .find((e) => e.name === newElement.name)
                ?.forms.map((form, i) => (
                  <MenuItem key={i} value={form.name}>
                    {form.name}
                  </MenuItem>
                ))}
          </Select>

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
        </Stack>
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
  const initialState = {
    name: "",
    description: "Fertilazer Unit",
    minFlowRate: 0.4,
    maxFlowRate: 4.0,
    concentrate: null,
    flowRate: 0.4,
    factor: 1,
  };
  const [pump, setPump] = useState(initialState);
  const [addPumpToUnitDialog] = useAddPumpToFertilizerUnitMutation();
  const { data: concentrates } = useGetAllConcentratesQuery();
  const handleAddPump = () => {
    if (pump?.name) {
      addPumpToUnitDialog({ id: unit, body: pump });
      if (onClose) {
        onClose();
      }
    }
    setPump(initialState);
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Concentrate</DialogTitle>
      <DialogContent>
        <Box>
          {concentrates?.length > 0 && (
            <Select
              value={pump?.concentrate || ""}
              renderValue={(value) => {
                if (!value) {
                  return "Select Concentrate";
                }
                return concentrates.find((c) => c._id === value)?.name;
              }}
              onChange={(e) =>
                setPump({ ...pump, concentrate: e.target.value })
              }
            >
              {concentrates.map((c, i) => (
                <MenuItem key={i} value={c._id}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
          )}
          <Stack direction="column" spacing={1}>
            <TextField
              label="Name"
              value={pump?.name}
              onChange={(e) => setPump({ ...pump, name: e.target.value })}
            />
            <TextField
              label="Description"
              value={pump?.description}
              onChange={(e) =>
                setPump({ ...pump, description: e.target.value })
              }
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

export function AddRecipeDialog({ open, onClose }) {
  const ingredients = {
    N: 0,
    P: 0,
    K: 0,
    Ca: 0,
    Mg: 0,
    S: 0,
    Fe: 0,
    Cu: 0,
    Mn: 0,
    Zn: 0,
    B: 0,
    Mo: 0,
  };
 const initialState = {
  name: "",
  description: "",
  ...ingredients,
}
  const [newRecipe, setNewRecipe] = useState(initialState);
  const [createRecipe] = useCreateRecieptMutation();
  const handleAddRecipe = () => {
    if (newRecipe) {
      createRecipe(newRecipe);
      setNewRecipe(initialState);
      if (onClose) {
        onClose();
      }
    }
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Recipe</DialogTitle>
      <DialogContent>
        <Box>
          <TextField
            label="Name"
            value={newRecipe?.name}
            onChange={(e) =>
              setNewRecipe({ ...newRecipe, name: e.target.value })
            }
          />
          <TextField
            label="Description"
            value={newRecipe?.description}
            onChange={(e) =>
              setNewRecipe({ ...newRecipe, description: e.target.value })
            }
          />
          {Object.keys(ingredients).map((element, i) => (
            <TextField
              key={i}
              label={element}
              type="number"
              value={newRecipe?.[element]}
              onChange={(e) =>
                setNewRecipe({
                  ...newRecipe,
                  [element]: parseFloat(e.target.value),
                })
              }
            />
          ))  
          }
          <Button onClick={handleAddRecipe}>Add Recipe</Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
AddRecipeDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

export function EditRecipeDialog({ open, recipe, onClose }) {
  const { name, description, _id: id,__v, ...ingredients } = recipe;
  const [changes,setChanges] = useState(ingredients);
  const [updateRecipe] = useUpdateRecieptMutation();
  const handleEditRecipe = () => {
    if (changes) {
      updateRecipe({id, body:changes});
      setChanges(ingredients);
      if (onClose) {
        onClose();
      }
    }
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Recipe {name}</DialogTitle>
      <DialogContent>
        <Stack
          direction="column"
          spacing={1}
        >
          {Object.keys(changes).map((element, i) => (
            <TextField
              key={i}
              label={element}
              type="number"
              value={changes?.[element]}
              onChange={(e) =>
                setChanges({
                  ...changes,
                  [element]: parseFloat(e.target.value),
                })
              }
            />
          ))  
          }
          <Button onClick={handleEditRecipe}>Edit Recipe</Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
EditRecipeDialog.propTypes = {
  open: PropTypes.bool,
  recipe: PropTypes.object,
  onClose: PropTypes.func,
};

export function AddWaterDialog({ open, onClose }) {
  const [newWater, setNewWater] = useState(null);
  const [createWater] = useCreateWaterMutation();
  const handleAddWater = () => {
    if (newWater.name&&newWater.description) {
      createWater(newWater);
      setNewWater(null);
      if (onClose) {
        onClose();
      }
    }
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Water</DialogTitle>
      <DialogContent>
        <Box>
          <TextField
            label="Name"
            value={newWater?.name}
            onChange={(e) => setNewWater({ ...newWater, name: e.target.value })}
          />
          <TextField
            label="Description"
            value={newWater?.description}
            onChange={(e) =>
              setNewWater({ ...newWater, description: e.target.value })
            }
          />
          <TextField
            label="pH"
            type="number"
            value={newWater?.pH}
            onChange={(e) =>
              setNewWater({ ...newWater, pH: parseFloat(e.target.value) })
            }
          />
          <TextField
            label="EC"
            type="number"
            value={newWater?.EC}
            onChange={(e) =>
              setNewWater({ ...newWater, EC: parseFloat(e.target.value) })
            }
          />
          <Button onClick={handleAddWater}>Add Water</Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
AddWaterDialog.propTypes = {
  open: PropTypes.bool,
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
          <SelectWater onChange={(water) => setNewUnit({ ...newUnit, water })} />
          <SelectRecipe onChange={(recipe) => setNewUnit({ ...newUnit, recipe })} />
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
