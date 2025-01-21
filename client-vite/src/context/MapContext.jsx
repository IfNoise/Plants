import { createContext, useState } from "react";
import PropTypes from "prop-types";
const MapContext = createContext();

const newId = () => {
  return Math.random().toString(36);
};
const MapProvider = ({ children }) => {
  const [map, setMap] = useState(null);

  const addplant = (plant, address) => {
    const { building, room } = address;
    const row = address?.row - 1 || undefined;
    const rack = address?.rack - 1 || undefined;
    const shelf = address?.shelf - 1 || undefined;
    const tray = address?.tray - 1 || undefined;
    setMap((prevMap) => {
      // Создаем глубокую копию карты
      const newMap = JSON.parse(JSON.stringify(prevMap));

      if (rack !== undefined) {
        // Убедимся, что массив plants существует
        if (!newMap[building][room]?.racks[rack]?.shelfs[shelf]?.plants) {
          newMap[building][room].racks[rack].shelfs[shelf].plants = [];
        }

        // Создаем новый массив с добавленным растением
        newMap[building][room].racks[rack].shelfs[shelf].plants = [
          ...newMap[building][room].racks[rack].shelfs[shelf].plants,
          { ...plant, id: newId() },
        ];
      } else if (row !== undefined) {
        // Убедимся, что массив plants существует
        if (!newMap[building][room]?.rows[row]?.trays[tray]?.plants) {
          newMap[building][room].rows[row].trays[tray].plants = [];
        }

        // Создаем новый массив с добавленным растением
        newMap[building][room].rows[row].trays[tray].plants = [
          ...newMap[building][room].rows[row].trays[tray].plants,
          { ...plant, id: newId() },
        ];
      }
      return newMap;
    });
  };

  const removePlant = (plant, address) => {
    const { building, room } = address;
    const row = address?.row - 1 || undefined;
    const rack = address?.rack - 1 || undefined;
    const shelf = address?.shelf - 1 || undefined;
    const tray = address?.tray - 1 || undefined;
    setMap((prevMap) => {
      // Создаем глубокую копию карты
      const newMap = JSON.parse(JSON.stringify(prevMap));
      if (rack > 1)
        newMap[building][room].racks[rack].shelfs[shelf].plants = newMap[
          building
        ][room].racks[rack].shelfs[shelf].plants.filter((p) => p !== plant);
      else if (row > 1)
        newMap[building][room].rows[row].trays[tray].plants = newMap[building][
          room
        ].rows[row].trays[tray].plants.filter((p) => p !== plant);
      console.log("New map", newMap);
      return newMap;
    });
  };
  return (
    <MapContext.Provider
      value={{
        map,
        setMap,
        addplant,
        removePlant,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};
MapProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { MapContext, MapProvider };
