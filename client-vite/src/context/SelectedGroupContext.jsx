import { createContext, useState } from "react";

const SelectedGroupContext = createContext();

const SelectedGroupProvider = ({ children }) => {
  const [selectedGroup, setSelectedGroup] = useState(null);

  return (
    <SelectedGroupContext.Provider value={{ selectedGroup, setSelectedGroup }}>
      {children}
    </SelectedGroupContext.Provider>
  );
};

export { SelectedGroupContext, SelectedGroupProvider };
