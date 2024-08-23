import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Button,
  Card,
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
} from "@mui/material";
import PropTypes from "prop-types";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { AddConcentrateDialog, AddFertilizerDialog,EditConcentrationDialog  } from "./Helpers";
import { editConcentrateElement,removeConcentrateElement } from "../../store/nutrientsSlice";
import { elements } from "../../config/config";



const ConcentrateCard = ({ concentrate }) => {
  const concentrates = useSelector((state) => state.nutrients.concentrates);
  const fertilizers = useSelector((state) => state.nutrients.fertilizers);
  const dispatch = useDispatch();
  const [solution, setSolution] = useState([]);
  const coefficients = elements.map((element) => element.content).flat();
  const { name, description, content } = concentrates.find(
    (c) => c.name === concentrate
  );
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState([]);

  const [elementsList, setElementsList] = useState([]);
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

  const handleEdit = (element, concentration) => {
    dispatch(
      editConcentrateElement({
        name: concentrate,
        fertilizer:element,
        concentration,
      })
    );
  };

  const closeDialog = (index) => {
    setOpenEdit((prev) => {
      return prev.map((v, j) => (index === j ? false : v));
    });
  };
  

  useEffect(() => {
    if (content?.length > 0) {
      const elements = content
        .map((fertilizer) => {
          const frt = fertilizers.find((f) => f.name === fertilizer.name);
          return {
            name: fertilizer.name,
            concentration: fertilizer.concentration,
            elements: frt.content,
          };
        })
        .map((f) => {
          return f.elements.map((element) => {
            return {
              name: element.name,
              concentration: (
                (element.concentration * f.concentration/1000)
              ).toFixed(2),
            };
          });
        })
        .flat()
        .sort((a, b) => a.id - b.id)
        .reduce((acc, element) => {
          const existing = acc.find((e) => e.name === element.name);
          if (existing) {
            existing.concentration = (parseFloat(existing.concentration)+parseFloat(element.concentration)).toFixed(2);
          } else {
            acc.push(element);
          }
          return acc;
        }, [])
      setElementsList(elements);
    }
  }, [content]);
useEffect(() => {
    
const solution=content.map((fertilizer) => {
          return {
            name: fertilizer.name,
            concentration: (
              (fertilizer.concentration * 0.4) /
              100
            ).toFixed(3),
          };
        })
      .flat()
      .map((fertilizer) => {
        const frt = fertilizers.find((f) => f.name === fertilizer.name);
        return {
          name: fertilizer.name,
          concentration: fertilizer.concentration,
          elements: frt.content,
        };
      })
      .map((f) => {
        return f.elements.map((element) => {
          return {
            name: element.name,
            concentration: (element.concentration * f.concentration*10).toFixed(1),
          };
        });
      })
      .flat()
      .map((element) => {
        return {
          id:
            elements.find((e) => element.name?.startsWith(e.code))?.id ||
            element.id,
          name:
            elements.find((e) => element.name?.startsWith(e.code))?.code ||
            element.name,
          concentration:
            element.concentration *
            coefficients.find((c) => element.name === c.element).coef,
        };
      })
      .sort((a, b) => a.id - b.id)
      .reduce((acc, element) => {
        const existing = acc.find((e) => e.name === element.name);
        if (existing) {
          existing.concentration += element.concentration;
        } else {
          acc.push(element);
        }
        return acc;
      }, []);

    setSolution(solution)
  }, [ concentrates, fertilizers,coefficients]);
  return (
    <Card 
    sx={{
      width: "70vw",
      margin: "10px",
      padding: "10px",
    }}
    >
      <CardHeader variant="h4" title={name}></CardHeader>
      <CardContent>
        <Typography variant="h6">{description}</Typography>
        <Stack
          direction="row"
          margin={2}
          spacing={2}
          useFlexGap 
          flexWrap="wrap"

        >
        <Table 
        sx={{
          margin: "10px",
          marginLeft: "0px",
          padding: "10px",
          width: "auto",
        }}
        >
          <TableHead>
            <TableRow 
            sx={{
              m:"2px"
            }}
            >
              <TableCell>Nutrient</TableCell>
              <TableCell>Concentration</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {content?.length > 0 &&
              content.map((element, i) => (
                <TableRow key={i}>
                  <TableCell>{element.name}</TableCell>
                  <TableCell>{element.concentration}g</TableCell>
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
                        handleEdit(element.name, concentration);
                      }}
                      onClose={() =>
                        closeDialog(i)
                      }
                    />

                    <IconButton
                      onClick={() =>
                        dispatch(
                          removeConcentrateElement({
                            name: concentrate,
                            fertilizer: element.name,
                          })
                        )
                      }
                    >
                      <DeleteForeverIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        
        <Table sx={{
          margin: "10px",
          marginLeft: "0px",
          padding: "10px",
          width: "auto",
        }}>
          <TableHead
          sx={{
            backgroundColor: "rgba(0,0,0,0.1)",
          }}
          >
            <TableRow>
              {elementsList?.length > 0 &&
                elementsList.map((element, i) => (
                  <TableCell key={i}>{element.name}</TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              {elementsList?.length > 0 &&
                elementsList.map((element, i) => (
                  <TableCell key={i}>{element.concentration}%</TableCell>
                ))}
            </TableRow>
          </TableBody>
        </Table>
        <Table 
        sx={
          {
            margin: "10px",
            marginLeft: "0px",
            padding: "10px",
            width: "auto",
        }}
        >
        <TableHead
        sx={{
          backgroundColor: "rgba(0,0,0,0.1)",
        }}
        
        >
          <TableRow>
            {solution?.length > 0 &&
              solution.map((element, i) => (
                <TableCell key={i}>{element.name}</TableCell>
              ))}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            {solution?.length > 0 &&
              solution.map((element, i) => (
                <TableCell key={i}>
                  {element.concentration.toFixed(1)}
                </TableCell>
              ))}
          </TableRow>
        </TableBody>
        </Table>
        </Stack>
        <Button onClick={() => setOpen(true)}>Add Fertilizer</Button>

        <AddFertilizerDialog
          open={open}
          onClose={() => setOpen(false)}
          concentrate={name}
        />
      </CardContent>
    </Card>
  );
};
ConcentrateCard.propTypes = {
  concentrate: PropTypes.string.isRequired,
};

export default function ConcentrateList() {
  const concentrates = useSelector((state) => state.nutrients.concentrates);
  const [open, setOpen] = useState(false);
 
  return (
    <Box>
      <Stack
        direction="column"
        margin={2}
        spacing={2}
        justifyContent="center"
      >
      {concentrates.map((concentrate, i) => (
        <ConcentrateCard key={i} concentrate={concentrate.name} />
      ))}
      </Stack>
      <Button
        onClick={() => {
          setOpen(true);
        }}
      >Add Concentrate</Button>
      <AddConcentrateDialog
        open={open}
        onClose={() => setOpen(false)}
      />  
    </Box>
  );
}