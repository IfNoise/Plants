import {
  Box,
  Card,
  IconButton,
  Menu,
  MenuItem,
  Slider,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import {
  useGetLightChannelStateQuery,
  useRemoveChannelMutation,
  useSetMaxLevelMutation,
} from "../../store/lightApi";
import { selectChannel } from "../../store/channelsSlice";
import AvTimerIcon from "@mui/icons-material/AvTimer";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import CircularProgressWithLabel from "../CircularProgress";
import LockWrapper from "./LockWrapper";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AreYouSure from "../AreYouSure";

const MAX_LEVEL = 10000;

function valuetext(value) {
  return `${value}%`;
}

/**
 * Карточка канала освещения с управлением яркостью
 * @param {Object} props - свойства компонента
 * @param {Object} props.channel - данные канала
 * @param {Function} props.onEdit - обработчик редактирования канала
 */
const ChannelCard = ({ channel, onEdit }) => {
  const { name, maxLevel, manual } = channel;
  const [contextMenu, setContextMenu] = useState(null);
  const [maxValue, setMaxValue] = useState((maxLevel / MAX_LEVEL) * 100);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // WebSocket integration - получаем реал-тайм данные
  const realtimeChannel = useSelector((state) => selectChannel(state, name));

  // Fallback к polling если WebSocket не предоставляет данные
  const { data: polledState } = useGetLightChannelStateQuery(name, {
    pollingInterval: 60000,
    skip: !!realtimeChannel, // Пропускаем polling если есть WebSocket данные
  });

  // Используем реал-тайм данные если доступны, иначе polled данные
  const currentChannel = realtimeChannel || channel;
  const currentState = realtimeChannel?.level ?? polledState?.state;

  useEffect(() => {
    // Обновляем maxValue из текущих данных канала
    const currentMaxLevel = currentChannel.maxLevel ?? maxLevel;
    setMaxValue((currentMaxLevel / MAX_LEVEL) * 100);
  }, [currentChannel.maxLevel, maxLevel]);

  const [setMaxLevel] = useSetMaxLevelMutation();
  const [removeChannel] = useRemoveChannelMutation();

  const handleContextMenu = (event) => {
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : null,
    );
  };

  const handleEditClick = (event) => {
    event?.stopPropagation();
    setContextMenu(null);
    onEdit?.(channel);
  };

  const handleRemoveClick = (event) => {
    event?.stopPropagation();
    setContextMenu(null);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    setShowDeleteDialog(false);
    removeChannel(name);
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
  };

  const handleMaxLevelChange = (e, newValue) => {
    setMaxValue(newValue);
  };

  const handleMaxLevelCommit = () => {
    setMaxLevel({ name, maxLevel: (MAX_LEVEL * maxValue) / 100 });
  };

  return (
    <>
      <LockWrapper lockedDefault={true}>
        <Card
          sx={{
            p: "8px",
            display: "flex",
            flexDirection: "column",
            width: "100px",
            position: "relative",
          }}
          onContextMenu={handleContextMenu}
        >
          <Stack
            direction="row"
            spacing={0.5}
            sx={{
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 0.5,
            }}
          >
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="body"
                sx={{
                  fontWeight: "bold",
                  fontSize: "10px",
                  wordBreak: "break-word",
                }}
              >
                {name}
              </Typography>
            </Box>
            <Stack direction="row" spacing={0}>
              <IconButton
                size="small"
                onClick={handleEditClick}
                sx={{
                  p: 0.25,
                  minWidth: 0,
                  width: "16px",
                  height: "16px",
                }}
                title="Редактировать"
              >
                <EditIcon sx={{ fontSize: "12px" }} />
              </IconButton>
              <IconButton
                size="small"
                onClick={handleRemoveClick}
                sx={{
                  p: 0.25,
                  minWidth: 0,
                  width: "16px",
                  height: "16px",
                }}
                title="Удалить"
              >
                <DeleteIcon sx={{ fontSize: "12px" }} />
              </IconButton>
            </Stack>
          </Stack>

          {manual ? (
            <TouchAppIcon
              sx={{
                fontSize: "18px",
                alignSelf: "flex-end",
              }}
              color="error"
            />
          ) : (
            <AvTimerIcon
              sx={{
                fontSize: "18px",
                alignSelf: "flex-end",
              }}
              color="success"
            />
          )}

          <Stack
            sx={{
              alignItems: "center",
            }}
            direction="column"
            spacing={1}
          >
            <CircularProgressWithLabel
              variant="determinate"
              value={Math.floor((currentState / MAX_LEVEL) * 100) || 0}
              sx={{
                color: "success.light",
              }}
            />
            <Slider
              sx={{
                height: "90px",
                width: "35px",
                color: "success.main",
              }}
              size="small"
              orientation="vertical"
              getAriaLabel={() => "Максимальная яркость"}
              valueLabelDisplay="on"
              getAriaValueText={valuetext}
              disableSwap
              min={0}
              max={100}
              value={Math.floor(maxValue) || 0}
              onChange={handleMaxLevelChange}
              onChangeCommitted={handleMaxLevelCommit}
            />
          </Stack>
        </Card>
      </LockWrapper>

      <Menu
        open={contextMenu !== null}
        onClose={() => setContextMenu(null)}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem onClick={handleEditClick}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Редактировать
        </MenuItem>
        <MenuItem onClick={handleRemoveClick}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Удалить
        </MenuItem>
      </Menu>

      <AreYouSure
        show={showDeleteDialog}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        message={`Вы уверены, что хотите удалить канал "${name}"?`}
      />
    </>
  );
};

ChannelCard.propTypes = {
  channel: PropTypes.shape({
    name: PropTypes.string.isRequired,
    maxLevel: PropTypes.number.isRequired,
    minLevel: PropTypes.number,
    manual: PropTypes.bool,
    device: PropTypes.string,
    port: PropTypes.number,
  }).isRequired,
  onEdit: PropTypes.func,
};

export default ChannelCard;
