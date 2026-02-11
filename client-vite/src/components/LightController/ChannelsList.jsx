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
import { useGetLightChannelsQuery } from "../../store/lightApi";
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

  const [channels, setChannels] = useState([]);
  const [editChannel, setEditChannel] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    if (!data) {
      return;
    }
    if (data?.length > 0 && channelNames?.length > 0) {
      const ch = data.filter((channel) => channelNames.includes(channel.name));
      setChannels(ch);
    }
    if (data?.length > 0 && !channelNames) {
      setChannels(data);
    }
  }, [data, channelNames]);

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
