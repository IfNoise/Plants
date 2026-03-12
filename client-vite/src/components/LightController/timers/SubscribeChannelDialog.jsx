import {
  Button,
  Checkbox,
  Dialog,
  IconButton,
  List,
  ListItem,
  Slide,
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  useGetLightChannelsQuery,
  useSubscribeMutation,
  useUnsubscribeMutation,
} from "../../../store/lightApi";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import { includes } from "./timerUtils";

const SubscribeChannelDialog = ({ timer }) => {
  const { data: availbleChannels } = useGetLightChannelsQuery();
  const [channelsList, setChannelsList] = useState([...timer.channels]);
  const [unsubscribeList, setUnsubscribeList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [haveModifications, setHaveModifications] = useState(false);
  const [subscribe] = useSubscribeMutation();
  const [unsubscribe] = useUnsubscribeMutation();

  const handlerSubcribe = () => {
    if (channelsList.length > 0 && !includes(timer.channels, channelsList)) {
      subscribe({
        name: timer.name,
        channels: channelsList.filter(
          (ch) => timer.channels.indexOf(ch) === -1,
        ),
      });
    }
    if (unsubscribeList.length > 0) {
      unsubscribe({ name: timer.name, channels: [...unsubscribeList] });
    }
    setChannelsList([...timer.channels]);
    setUnsubscribeList([]);
    setOpenDialog(false);
  };

  useEffect(() => {
    setHaveModifications(
      !includes(timer.channels, channelsList) || unsubscribeList.length > 0,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelsList, unsubscribeList]);

  return (
    <>
      <IconButton variant="contained" onClick={() => setOpenDialog(true)}>
        <PlaylistAddIcon />
      </IconButton>
      <Dialog
        TransitionComponent={Slide}
        open={openDialog}
        onClose={() => setChannelsList([])}
      >
        <Stack direction="column" spacing={1} margin={1}>
          <List>
            {availbleChannels?.length > 0 &&
              availbleChannels.map((channel, idx) => (
                <ListItem key={idx} variant="contained" color="primary">
                  {channel.name}
                  <Checkbox
                    checked={channelsList.includes(channel.name)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        if (
                          channelsList.includes(channel.name) &&
                          timer?.channels.includes(channel.name)
                        ) {
                          return;
                        }
                        if (!timer?.channels.includes(channel.name)) {
                          setChannelsList([...channelsList, channel.name]);
                        }
                        if (unsubscribeList.includes(channel.name)) {
                          setUnsubscribeList(
                            unsubscribeList.filter(
                              (item) => item !== channel.name,
                            ),
                          );
                        }
                      } else {
                        setChannelsList(
                          channelsList.filter((item) => item !== channel.name),
                        );
                        if (timer?.channels.includes(channel.name)) {
                          setUnsubscribeList([
                            ...unsubscribeList,
                            channel.name,
                          ]);
                        }
                      }
                    }}
                  />
                </ListItem>
              ))}
          </List>
          <pre
            style={{ overflow: "auto", maxHeight: "200px", fontSize: "10px" }}
          >
            {JSON.stringify(channelsList, null, 2)}
          </pre>
          <pre
            style={{ overflow: "auto", maxHeight: "200px", fontSize: "10px" }}
          >
            {JSON.stringify(unsubscribeList, null, 2)}
          </pre>
          <Button
            disabled={!haveModifications}
            variant="contained"
            color="primary"
            onClick={handlerSubcribe}
          >
            Subscribe
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => setOpenDialog(false)}
          >
            Close
          </Button>
        </Stack>
      </Dialog>
    </>
  );
};

SubscribeChannelDialog.propTypes = {
  timer: PropTypes.object.isRequired,
};

export default SubscribeChannelDialog;
