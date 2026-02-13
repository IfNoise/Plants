import {
  Box,
  FormControlLabel,
  Radio,
  RadioGroup,
  Tooltip,
} from "@mui/material";
import PropTypes from "prop-types";
import AvTimerIcon from "@mui/icons-material/AvTimer";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import MapIcon from "@mui/icons-material/Map";
import AddIcon from "@mui/icons-material/Add";

const radioProps = {
  size: "small",
};

const MODE = {
  OFF: 0,
  MANUAL: 1,
  AUTO: 2,
  MAP: 3,
};

function ModeIcon({
  modeValue,
  selected,
  variant = "mode",
  fontSize = 18,
  activeColor,
}) {
  // OFF mode should always render in red (error color)
  const isOff = modeValue === MODE.OFF;
  const color = isOff
    ? "error.main"
    : selected
      ? activeColor || "primary.main"
      : "text.secondary";
  const sx = { color, width: fontSize, height: fontSize };

  if (variant === "plus") return <AddIcon sx={sx} />;

  switch (modeValue) {
    case MODE.AUTO:
      return <AvTimerIcon sx={sx} />;
    case MODE.MANUAL:
      return <TouchAppIcon sx={sx} />;
    case MODE.MAP:
      return <MapIcon sx={sx} />;
    default:
      return <PowerSettingsNewIcon sx={sx} />;
  }
}

ModeIcon.propTypes = {
  modeValue: PropTypes.number.isRequired,
  selected: PropTypes.bool,
  variant: PropTypes.oneOf(["mode", "plus"]),
  fontSize: PropTypes.number,
  activeColor: PropTypes.string,
};

/**
 * Timer mode selector component
 * - interactive: when false renders a read-only indicator
 * - showIcons: render icons for options
 * - iconVariant: 'mode' (mode-specific icon) or 'plus' (plus icon)
 */
const TimerMode = ({
  mode,
  onChange,
  showMapMode = false,
  interactive = true,
  showIcons = true,
  iconVariant = "mode",
  activeColor = "#1976d2",
}) => {
  const options = [
    { value: MODE.AUTO, label: "Auto" },
    { value: MODE.MANUAL, label: "Manual" },
    { value: MODE.OFF, label: "Off" },
  ];
  if (showMapMode) options.push({ value: MODE.MAP, label: "Map" });

  // read-only (indicator) mode
  if (!interactive) {
    const selected =
      options.find((o) => o.value === Number(mode)) || options[2];
    return (
      <Box
        sx={{ display: "inline-flex", alignItems: "center", gap: 1, pt: 0.5 }}
      >
        {showIcons ? (
          <Tooltip title={selected.label}>
            <Box>
              <ModeIcon
                modeValue={selected.value}
                selected={true}
                variant={iconVariant}
                fontSize={20}
                activeColor={activeColor}
              />
            </Box>
          </Tooltip>
        ) : (
          <Box sx={{ fontSize: 12, color: "text.secondary" }}>
            {selected.label}
          </Box>
        )}
      </Box>
    );
  }

  // interactive mode with icon-only radio buttons (icons act as the radio control)
  return (
    <Box
      sx={{
        m: "5px",
        p: "5px",
        borderWidth: "1px",
        borderRadius: "4px",
      }}
    >
      <RadioGroup
        row
        aria-label="mode"
        name="mode"
        value={mode}
        onChange={onChange}
      >
        {options.map((opt) => {
          return (
            <Tooltip key={opt.value} title={opt.label}>
              <FormControlLabel
                value={opt.value}
                // render the icon itself as the radio (icon when unchecked, checkedIcon when checked)
                control={
                  <Radio
                    {...radioProps}
                    icon={
                      <ModeIcon
                        modeValue={opt.value}
                        selected={false}
                        variant={iconVariant}
                        fontSize={20}
                        activeColor={activeColor}
                      />
                    }
                    checkedIcon={
                      <ModeIcon
                        modeValue={opt.value}
                        selected={true}
                        variant={iconVariant}
                        fontSize={20}
                        activeColor={activeColor}
                      />
                    }
                    sx={{
                      color: "transparent", // hide default radio color — icon provides color
                      padding: 2,
                      marginRight: 0,
                      "&.Mui-checked": { color: "transparent" },
                    }}
                    inputProps={{ "aria-label": opt.label }}
                  />
                }
                label={""}
                sx={{ mr: 1 }}
              />
            </Tooltip>
          );
        })}
      </RadioGroup>
    </Box>
  );
};

TimerMode.propTypes = {
  mode: PropTypes.oneOf([0, 1, 2, 3]).isRequired,
  onChange: PropTypes.func,
  showMapMode: PropTypes.bool,
  interactive: PropTypes.bool,
  showIcons: PropTypes.bool,
  iconVariant: PropTypes.oneOf(["mode", "plus"]),
  activeColor: PropTypes.string,
};

TimerMode.defaultProps = {
  showMapMode: false,
  interactive: true,
  showIcons: true,
  iconVariant: "mode",
};

// backward-compatible default for newly added prop
TimerMode.defaultProps = {
  ...TimerMode.defaultProps,
  activeColor: "#1976d2",
};

export default TimerMode;
