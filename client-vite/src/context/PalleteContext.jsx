import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useGetPlantsQuery } from "../store/plantsApi";

const PalleteContext = createContext();

const PalleteProvider = ({ children }) => {
  const {
    data: clones,
    isLoading,
    isError,
    error,
  } = useGetPlantsQuery({ state: "Growing" });
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [items, setItems] = useState([]);
  const findByGroup = (group) => {
    return items.find((item) => item.group === group);
  };
  const selectNext = () => {
    const nextIndex =
      items.findIndex(
        (item) =>
          item.pheno === selectedGroup.pheno &&
          item.group === selectedGroup.group
      ) + 1;
    if (nextIndex < items.length) {
      setSelectedGroup(items[nextIndex]);
    }
  };
  const incrementCounter = (group) => {
    setItems((prev) => {
      const newItems = [...prev];
      const item = findByGroup(group);
      item.counter++;
      return newItems;
    });
  };
  const decrementCounter = (group) => {
    setItems((prev) => {
      const newItems = [...prev];
      const item = findByGroup(group);
      item.counter--;
      return newItems;
    });
  };
  useEffect(() => {
    if (clones) {
      setItems(() => {
        const groupedByPhenotype = clones.reduce((acc, clone) => {
          const { pheno, startDate, group } = clone;
          if (!acc[pheno]) {
            acc[pheno] = [];
          }
          acc[pheno].push({
            pheno,
            startDate,
            group,
          });
          return acc;
        }, {});
        const itemsTmp = [];
        Object.values(groupedByPhenotype).reduce((acc, phenotype) => {
          const groupedByGroup = phenotype.reduce((acc, clone) => {
            const { group, startDate } = clone;
            if (!acc[group]) {
              acc[group] = [];
            }
            acc[group].push({
              group,
              startDate,
            });
            return acc;
          }, {});

          Object.values(groupedByGroup).reduce((acc, clones) => {
            const counter = clones.length;
            const { group, startDate } = clones[0];
            const age = Math.floor(
              (new Date() - new Date(startDate)) / (1000 * 60 * 60 * 24)
            );
            itemsTmp.push({
              pheno: phenotype[0].pheno,
              group,
              age,
              counter,
            });
            return acc;
          }, []);
          return;
        }, itemsTmp);
        return itemsTmp;
      });
    }
  }, [clones]);
  useEffect(() => {
    setItems((prev) => {
      return prev.map((item) => {
        if (
          item.pheno === selectedGroup.pheno &&
          item.group === selectedGroup.group
        ) {
          return { ...item, counter: selectedGroup.counter };
        }
        return item;
      });
    });
    if (selectedGroup?.counter < 1) {
      selectNext();
    }
  }, [selectedGroup]);

  return (
    <PalleteContext.Provider
      value={{
        selectedGroup,
        setSelectedGroup,
        items,
        setItems,
        incrementCounter,
        decrementCounter,
        isLoading,
        isError,
        error,
      }}
    >
      {children}
    </PalleteContext.Provider>
  );
};

PalleteProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { PalleteContext, PalleteProvider };
