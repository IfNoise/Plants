import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Stack,
} from "@mui/material";
import { useState } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { selectAllChannels } from "../../../store/channelsSlice";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddChannelDialog from "./AddChannelDialog";
import ChannelCard from "./ChannelCard";
import ChannelEditDialog from "./ChannelEditDialog";
import DevicesManagerButton from "../devices/DevicesManagerButton";

const ChannelsList = ({ channels, addButton }) => {
  const [editChannel, setEditChannel] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const currentChannels = channels || [];

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
          <Stack direction="row" useFlexGap flexWrap="wrap" spacing={1}>
            {currentChannels?.length > 0 &&
              currentChannels?.map((channel) => (
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
  channels: PropTypes.arrayOf(PropTypes.object),
  addButton: PropTypes.bool,
};

export default ChannelsList;
