import { Alert, Box, CircularProgress } from "@mui/material";
import { useGetTimersQuery } from "../../../store/lightApi";
import TimerCard from "./TimerCard";
import AddTimerDialog from "./AddTimerDialog";

const TimerList = () => {
  const { data: timers, isLoading, isError, error } = useGetTimersQuery();

  return (
    <Box>
      {isLoading && <CircularProgress />}
      {isError && <Alert severity="error">{error.message}</Alert>}
      {timers?.length > 0 &&
        timers.map((timer, idx) => <TimerCard key={idx} timer={timer} />)}
      <AddTimerDialog />
    </Box>
  );
};

export default TimerList;
