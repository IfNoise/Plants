import { Box, Checkbox } from "@mui/material";
import { useState } from "react";
import PropTypes from "prop-types";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";

/**
 * Компонент-обертка для блокировки взаимодействия с дочерними элементами
 * @param {Object} props - свойства компонента
 * @param {React.ReactNode} props.children - дочерние элементы для обертывания
 * @param {boolean} props.lockedDefault - начальное состояние блокировки
 */
const LockWrapper = ({ children, lockedDefault = true }) => {
  const [locked, setLocked] = useState(lockedDefault);

  return (
    <Box
      sx={{
        position: "relative",
        zIndex: 0,
      }}
    >
      {children}
      {locked && (
        <>
          <Box
            sx={{
              borderRadius: "10px",
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 1100,
              pointerEvents: "none",
            }}
          />
          <Box
            sx={{
              borderRadius: "10px",
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1101,
              pointerEvents: "all",
            }}
          />
        </>
      )}
      <Checkbox
        checked={locked}
        size="small"
        sx={{
          position: "absolute",
          bottom: "0px",
          right: "0px",
          zIndex: 1102,
        }}
        icon={<LockOpenIcon />}
        checkedIcon={<LockIcon />}
        onChange={(e) => setLocked(e.target.checked)}
      />
    </Box>
  );
};

LockWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  lockedDefault: PropTypes.bool,
};

export default LockWrapper;
