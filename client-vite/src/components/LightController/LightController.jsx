import { Card, Alert, Stack } from "@mui/material";
import ChannelsList from "./ChannelsList";
import TimerList from "./TimerList";
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
          background: "rgba(104,104,125,0.9)",
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
