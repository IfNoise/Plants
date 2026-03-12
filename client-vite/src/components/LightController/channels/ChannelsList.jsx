import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Alert,
  CircularProgress,
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { useGetLightChannelsQuery } from "../../../store/lightApi";
import { selectAllChannels } from "../../../store/channelsSlice";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddChannelDialog from "./AddChannelDialog";
import ChannelCard from "./ChannelCard";
import ChannelEditDialog from "./ChannelEditDialog";
import DevicesManagerButton from "../devices/DevicesManagerButton";

const ChannelsList = ({ channelNames, addButton }) => {
  const { data, isLoading, isSuccess, isError, error } =
    useGetLightChannelsQuery({});

  const realtimeChannels = useSelector(selectAllChannels);

  const [channels, setChannels] = useState([]);
  const [editChannel, setEditChannel] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    const channelsToUse =
      Object.keys(realtimeChannels).length > 0
        ? Object.values(realtimeChannels)
        : data || [];

    if (channelsToUse.length > 0 && channelNames?.length > 0) {
      setChannels(
        channelsToUse.filter((channel) => channelNames.includes(channel.name)),
      );
    } else if (channelsToUse.length > 0 && !channelNames) {
      setChannels(channelsToUse);
    }
  }, [data, realtimeChannels, channelNames]);

  const handleEditChannel = (channel) => {
    setEditChannel(channel);
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditChannel(null);
  };

  return (
    <>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          Каналы освещения
        </AccordionSummary>

        <AccordionDetails>
          {isLoading && <CircularProgress />}
          {isError && (
            <Alert severity="error">
              {error?.message || "Ошибка загрузки"}
            </Alert>
          )}

          <Stack direction="row" useFlexGap flexWrap="wrap" spacing={1}>
            {isSuccess &&
              channels?.map((channel) => (
                <ChannelCard
                  key={channel.name}
                  channel={channel}
                  onEdit={handleEditChannel}
                />
              ))}
          </Stack>
        </AccordionDetails>

        {addButton && (
          <AccordionActions>
            <AddChannelDialog />
            <DevicesManagerButton />
          </AccordionActions>
        )}
      </Accordion>

      <ChannelEditDialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        channel={editChannel}
      />
    </>
  );
};

ChannelsList.propTypes = {
  channelNames: PropTypes.array,
  addButton: PropTypes.bool,
};

export default ChannelsList;
