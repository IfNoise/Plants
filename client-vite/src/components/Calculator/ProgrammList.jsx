import { Box, Button, DialogContent, DialogTitle, Dialog } from "@mui/material";
import {
  useGetAllProgramsQuery,
  useGetRecieptByIdQuery,
} from "../../store/feedingApi";
import { AddProgramDialog, RecipeTable } from "./Helpers";
import PropTypes from "prop-types";
import { useState } from "react";
import RecipeList from "./RecipeList";

const SelectRecipeDialog = ({ open, onSelect, onClose }) => {
  const handleSelect = (recipe) => {
    onSelect(recipe);
    onClose();
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Select a Recipe</DialogTitle>
      <DialogContent>
        <RecipeList onSelect={handleSelect} />
      </DialogContent>
    </Dialog>
  );
};
SelectRecipeDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export const StageCard = ({ stage }) => {
  const { name, description, duration, _id: id, recipe } = stage;
  const { data: recipeData, isLoading } = useGetRecieptByIdQuery(recipe);
  const [openSelectRecipe, setOpenSelectRecipe] = useState(false);
  const handleSelectRecipe = (selectedRecipe) => {
    // Handle the selected recipe here
    console.log("Selected Recipe:", selectedRecipe);
  };
  const handleOpenSelectRecipe = () => {
    setOpenSelectRecipe(true);
  };
  const handleCloseSelectRecipe = () => {
    setOpenSelectRecipe(false);
  };
  return (
    <Box
      sx={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "16px",
        marginBottom: "16px",
      }}
    >
      <h3>{name}</h3>
      <p>{description}</p>
      <p>Duration: {duration} days</p>
      {isLoading ? (
        <p>Loading recipe...</p>
      ) : recipeData ? (
        <Box>
          <RecipeTable recipe={recipeData} />
        </Box>
      ) : (
        <p>No recipe found.</p>
      )}
      {/* Add any other relevant information about the stage here */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "16px",
        }}
      >
        <Button
          onClick={handleOpenSelectRecipe}
          variant="contained"
          color="primary"
          sx={{ marginRight: "8px" }}
        >
          Edit
        </Button>
      </Box>
      <SelectRecipeDialog
        open={openSelectRecipe}
        onSelect={handleSelectRecipe}
        onClose={handleCloseSelectRecipe}
      />
    </Box>
  );
};

export function ProgramCard({ program }) {
  const { name, description, stages } = program;
  return (
    <Box
      sx={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "16px",
        marginBottom: "16px",
      }}
    >
      <h3>{name}</h3>
      <p>{description}</p>
      {stages.map((stage) => (
        <StageCard key={stage._id} stage={stage} />
      ))}
      <Button>Add Stage</Button>
    </Box>
  );
}

export default function ProgramList() {
  const { data: programs, isLoading, isError } = useGetAllProgramsQuery();
  const [openAddProgram, setOpenAddProgram] = useState(false);
  const handleOpenAddProgram = () => {
    setOpenAddProgram(true);
  };
  const handleCloseAddProgram = () => {
    setOpenAddProgram(false);
  };
  if (isLoading) {
    return <p>Loading programs...</p>;
  }
  if (isError) {
    return <p>Error loading programs.</p>;
  }
  return (
    <Box>
      {programs.map((program) => (
        <ProgramCard key={program._id} program={program} />
      ))}
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenAddProgram}
      >
        Add Program
      </Button>
      <AddProgramDialog open={openAddProgram} onClose={handleCloseAddProgram} />
    </Box>
  );
}
