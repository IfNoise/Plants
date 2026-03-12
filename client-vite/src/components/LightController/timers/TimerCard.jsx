import {
  Box,
  Card,
  CardActions,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Slider,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import {
  useGetLightChannelsQuery,
  useSetMaxLevelMutation,
  useStartTimerMutation,
  useStopTimerMutation,
} from "../../../store/lightApi";
import StyledSwitch from "../../StyledSwitch";
import TimeRangeDial from "../../TimeRangeDial";
import ChannelsList from "../channels/ChannelsList";
import SubscribeChannelDialog from "./SubscribeChannelDialog";
import TimerSettingsDialog from "./TimerSettingsDialog";
import { MAX_LEVEL, minutesToDate } from "./timerUtils";

const TimerCard = ({ timer }) => {
  const { name, steps, stepTime, sunriseTime, sunsetTime, state, channels } =
    timer;
  const [starTimer] = useStartTimerMutation();
  const [stopTimer] = useStopTimerMutation();
  const [setMaxLevel] = useSetMaxLevelMutation();
  const { data: lightChannels } = useGetLightChannelsQuery();
  const [masterLevel, setMasterLevel] = useState(50);
  const [oldMasterLevel, setOldMasterLevel] = useState(50);
  const [faderMode, setFaderMode] = useState("fadeLevel");

  useEffect(() => {
    if (channels.length > 0) {
      channels.forEach((channel) => {
        const channelData = lightChannels?.find(
          (item) => item.name === channel,
        );
        let level = 0;
        if (channelData === undefined) return;

        if (faderMode === "maxLevel") {
          level = Math.floor((MAX_LEVEL * masterLevel) / 100);
          setMaxLevel({ name: channel, maxLevel: level });
        } else if (faderMode === "fadeLevel") {
          if (oldMasterLevel > masterLevel) {
            level =
              channelData.maxLevel -
              (MAX_LEVEL * (oldMasterLevel - masterLevel)) / 100;
          } else if (oldMasterLevel < masterLevel) {
            level =
              channelData.maxLevel +
              (MAX_LEVEL * (masterLevel - oldMasterLevel)) / 100;
          } else {
            level = channelData.maxLevel;
          }
        }

        if (level > MAX_LEVEL) level = MAX_LEVEL;
        if (level < 0) level = 0;

        setOldMasterLevel(masterLevel);
        setMaxLevel({ name: channel, maxLevel: Math.floor(level) });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [masterLevel, faderMode, channels, setMaxLevel]);

  return (
    <Card sx={{ m: "2px", p: "10px", width: "100%" }}>
      {name && (
        <Typography variant="h6" component="span">
          Timer:{name || ""}
        </Typography>
      )}
      <StyledSwitch
        sx={{ float: "right", margin: "5px" }}
        checked={state === "started"}
        onChange={(e) => {
          if (e.target.checked) starTimer({ name });
          else stopTimer({ name });
        }}
      />
      <Grid container spacing={2} sx={{ mt: 2, mb: 1 }}>
        <Grid item>
          {steps && (
            <Typography variant="caption" component="div">
              Steps:{steps || ""}
            </Typography>
          )}
          {stepTime && (
            <Typography variant="caption" component="div">
              stepTime: {stepTime || ""}
            </Typography>
          )}
          {sunriseTime && (
            <Typography variant="caption" component="div">
              Sunrise:
              {dayjs(minutesToDate(sunriseTime)).format("HH:mm").toString() ||
                ""}
            </Typography>
          )}
          {(sunsetTime !== "" || sunriseTime !== undefined) && (
            <Typography variant="caption" component="div">
              Sunset:
              {dayjs(minutesToDate(sunsetTime)).format("HH:mm").toString() ||
                ""}
            </Typography>
          )}
        </Grid>
        <Grid item>
          {sunriseTime !== undefined && sunsetTime !== undefined && (
            <Box sx={{ mt: -1 }}>
              <TimeRangeDial
                startSeconds={sunriseTime * 60}
                stopSeconds={sunsetTime * 60}
                size={84}
              />
            </Box>
          )}
        </Grid>
      </Grid>
      <Slider
        sx={{ width: "60%", color: "success.main", ml: "10px", height: "10px" }}
        value={masterLevel}
        valueLabelDisplay="on"
        step={1}
        marks
        min={0}
        max={100}
        onChange={(e, value) => setMasterLevel(value)}
      />
      <FormControl component="fieldset" sx={{ ml: "15px" }}>
        <RadioGroup
          row
          value={faderMode}
          onChange={(e) => setFaderMode(e.target.value)}
        >
          <FormControlLabel
            value="maxLevel"
            control={<Radio size="small" />}
            label="MaxLevel"
          />
          <FormControlLabel
            value="fadeLevel"
            control={<Radio size="small" />}
            label="FadeLevel"
          />
        </RadioGroup>
      </FormControl>
      {channels?.length > 0 && <ChannelsList channelNames={channels} />}

      <CardActions>
        <SubscribeChannelDialog timer={timer} />
        <TimerSettingsDialog timer={timer} />
      </CardActions>
    </Card>
  );
};

TimerCard.propTypes = {
  timer: PropTypes.object.isRequired,
};

export default TimerCard;
