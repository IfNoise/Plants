import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Alert,
  CircularProgress,
  IconButton,
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { useGetLightChannelsQuery } from "../../store/lightApi";
import { selectAllChannels } from "../../store/channelsSlice";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SettingsIcon from "@mui/icons-material/Settings";
import DevicesManagerDialog from "./DevicesManagerDialog";
import AddChannelDialog from "./AddChannelDialog";
import ChannelCard from "./ChannelCard";
import ChannelEditDialog from "./ChannelEditDialog";

/**
 * Компонент списка каналов освещения
 * @param {Object} props - свойства компонента
 * @param {Array} props.channelNames - массив имен каналов для отображения (если не указан, показываются все)
 * @param {boolean} props.addButton - показывать кнопки добавления
 */
const ChannelsList = ({ channelNames, addButton }) => {
  const { data, isLoading, isSuccess, isError, error } =
    useGetLightChannelsQuery({});

  // WebSocket integration - получаем реал-тайм данные из Redux
  const realtimeChannels = useSelector(selectAllChannels);

  const [channels, setChannels] = useState([]);
  const [editChannel, setEditChannel] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    // Используем WebSocket данные, если они есть, иначе данные из RTK Query
    const channelsToUse =
      Object.keys(realtimeChannels).length > 0
        ? Object.values(realtimeChannels)
        : data || [];

    if (channelsToUse.length > 0 && channelNames?.length > 0) {
      const ch = channelsToUse.filter((channel) =>
        channelNames.includes(channel.name),
      );
      setChannels(ch);
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

/**
 * Кнопка открытия менеджера устройств
 */
const DevicesManagerButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <IconButton onClick={() => setOpen(true)} title="Управление устройствами">
        <SettingsIcon />
      </IconButton>
      <DevicesManagerDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
};

ChannelsList.propTypes = {
  channelNames: PropTypes.array,
  addButton: PropTypes.bool,
};

export default ChannelsList;
