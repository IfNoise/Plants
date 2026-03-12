import { Card, Alert, Stack } from "@mui/material";
import ChannelsList from "./channels/ChannelsList";
import TimerList from "./timers/TimerList";
import useChannelsContext from "../../hooks/useChannelsContext";

const LightController = () => {
  const { isConnected } = useChannelsContext();

  return (
    <Stack spacing={1}>
      {!isConnected && (
        <Alert severity="warning">
          WebSocket не подключен. Данные могут быть неактуальными.
        </Alert>
      )}
      <Card
        sx={{
          p: "5px",
        }}
      >
        <ChannelsList addButton defaultCollapsed />
        <TimerList />
      </Card>
    </Stack>
  );
};

export default LightController;
