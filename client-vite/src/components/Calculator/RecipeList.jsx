import {
  Card,
  CardContent,
  CardHeader,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Typography,
  TableBody,
  CardActions,
  Stack,
  Box,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import IconButton from "@mui/material/IconButton";
import PropTypes from "prop-types";
import {
  useDeleteRecieptMutation,
  useGetAllRecieptsQuery,
} from "../../store/feedingApi";
import { AddRecipeDialog, EditRecipeDialog } from "./Helpers";
import { useState } from "react";

export function RecipeCard({ recipe, onSelect = () => {} }) {
  const { name, discription, _id: id, __v, ...ingridients } = recipe;
  const [open, setOpen] = useState(false);
  const [deleteRecipe] = useDeleteRecieptMutation();
  const handleSelect = () => {
    onSelect(recipe);
  };
  const deleteHandler = () => {
    deleteRecipe(id);
  };
  if (!recipe) return null;
  return (
    <Card onClick={handleSelect} sx={{ width: "100%" }}>
      <CardHeader title={name} />
      <CardContent>
        <Typography>{discription}</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ingredient</TableCell>
              {Object.keys(ingridients).map((key) => (
                <TableCell key={key}>{key}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Amount</TableCell>
              {Object.values(ingridients).map((value, index) => (
                <TableCell key={index}>{value}</TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
      <CardActions>
        <IconButton onClick={() => setOpen(true)}>
          <EditIcon />
        </IconButton>
        <IconButton onClick={deleteHandler}>
          <DeleteForeverIcon />
        </IconButton>
      </CardActions>
      <EditRecipeDialog
        open={open}
        onClose={() => setOpen(false)}
        recipe={recipe}
      />
    </Card>
  );
}
RecipeCard.propTypes = {
  recipe: PropTypes.object.isRequired,
  onSelect: PropTypes.func,
};

export default function RecipeList({ onSelect }) {
  const [open, setOpen] = useState(false);
  const {
    isLoading,
    isSuccess,
    isError,
    data: recipes,
  } = useGetAllRecieptsQuery();

  const handleSelectRecipe = (selectedRecipe) => {
    onSelect(selectedRecipe);
  };

  return (
    <Box>
      {isLoading && <CircularProgress />}
      {isError && <Alert severity="error">Error</Alert>}
      {isSuccess && recipes?.length > 0 && (
        <Stack spacing={2} direction="column">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe._id}
              recipe={recipe}
              onSelect={handleSelectRecipe}
            />
          ))}
        </Stack>
      )}
      <Button onClick={() => setOpen(true)}>Add Recipe</Button>
      <AddRecipeDialog open={open} onClose={() => setOpen(false)} />
    </Box>
  );
}
RecipeList.propTypes = {
  onSelect: PropTypes.func.isRequired,
};
