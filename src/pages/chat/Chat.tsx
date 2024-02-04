import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
// @mui
import { Card, Container, Stack } from '@mui/material';
// redux
import axiosInstance from 'src/utils/axios';
import { useWebsocket } from 'src/useWebsocket';
import { useSnackbar } from 'src/components/snackbar';
import { useAuthContext } from 'src/auth/useAuthContext';
import { useDispatch, useSelector } from '../../redux/store';
import {
  getContacts,
  getConversation,
  getParticipants,
  getConversations,
  addRecipients,
  sendMessage,
  markConversationAsRead,
  resetActiveConversation,
} from '../../redux/slices/chat';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// @types
import { IChatConversation, IChatParticipant, IChatSendMessage } from '../../@types/chat';
// sections
import ChatNav from './nav/ChatNav';
import ChatRoom from './room/ChatRoom';
import ChatMessageInput from './message/ChatMessageInput';
import ChatMessageList from './message/ChatMessageList';
import ChatHeaderDetail from './header/ChatHeaderDetail';
import ChatHeaderCompose from './header/ChatHeaderCompose';

// ----------------------------------------------------------------------

const CURRENT_USER_ID = '8864c717-587d-472a-929a-8e5f298024da-0';

export default function Chat() {
   const { themeStretch } = useSettingsContext();

    // const dispatch = useDispatch();

   const navigate = useNavigate();

   const { pathname } = useLocation();
     const { socket } = useWebsocket()
  //  const { conversationKey = '' } = useParams();

  // const { contacts, recipients, participants, activeConversationId } = useSelector(
  //   (state) => state.chat
  // );

  // const selectedConversation = useSelector(() => {
  //   if (activeConversationId) {
  //     // eslint-disable-next-line consistent-return
  //     conversations.forEach((conversation) => {
  //       if(conversation.id === activeConversationId){
  //         return conversation
  //       }
  //     })
  //   }

  //   return {
  //     id: '',
  //     messages: [],
  //     participants: [],
  //     unreadCount: 0,
  //     type: '',
  //   };
  // });

  //  const detailView = !!conversationKey;

  // const displayParticipants = participants.filter((item) => item.id !== CURRENT_USER_ID);

  // useEffect(() => {
  //   dispatch(getConversations());
  //   dispatch(getContacts());
  // }, [dispatch]);

  // useEffect(() => {
  //   const getDetails = async () => {
  //     dispatch(getParticipants(`${conversationKey}`));
  //     try {
  //       await dispatch(getConversation(`${conversationKey}`));
  //     } catch (error) {
  //       console.error(error);
  //       navigate(PATH_DASHBOARD.chat.new);
  //     }
  //   };

  //   if (conversationKey) {
  //     getDetails();
  //   } else if (activeConversationId) {
  //     dispatch(resetActiveConversation());
  //   }

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [conversationKey]);

  // useEffect(() => {
  //   if (activeConversationId) {
  //     dispatch(markConversationAsRead(activeConversationId));
  //   }
  // }, [dispatch, activeConversationId]);

  // const handleAddRecipients = (selectedRecipients: IChatParticipant[]) => {
  //    dispatch(addRecipients(selectedRecipients));
  // };

  const handleSendMessage = async (value: IChatSendMessage) => {
    try {
      //  dispatch(sendMessage(value));
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(value));
      }

    } catch (error) {
      console.error(error);
    }
  };
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();
  const [conversations, setConversations] = useState<IChatConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<IChatConversation | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [displayParticipants, setDisplayParticipants] = useState<IChatParticipant[] >([]);
  const detailView = false
  const setCurrentConversation = (consersation : IChatConversation) => {
    setActiveConversationId(consersation.ID.toString())
    setDisplayParticipants(consersation.Participants)
    setSelectedConversation(consersation)
  }

  useEffect(() => {
    axiosInstance
    .get(`/v1/core/getAllConversations`)
    .then((response) => {
      setConversations(response.data)
      console.log(response.data as IChatConversation[])
      setCurrentConversation(response.data[0])
    }).catch((error) => {
      enqueueSnackbar('Something Went Wrong!', { variant: 'error' });
    });
  }, [enqueueSnackbar, user]);

  return (
    <Container maxWidth={themeStretch ? false : 'xl'}>
     

      <Card sx={{ height: '72vh', display: 'flex' }}>
        <ChatNav conversations={conversations} activeConversationId={activeConversationId} setCurrentConversation={setCurrentConversation}/>

        <Stack flexGrow={1} sx={{ overflow: 'hidden' }}>
          {detailView ? (
            <ChatHeaderDetail participants={displayParticipants} />
          ) : (<></>
            // <ChatHeaderCompose
            //   recipients={recipients}
            //   contacts={Object.values(contacts.byId)}
            //   onAddRecipients={handleAddRecipients}
            // />
          )}

          <Stack
            direction="row"
            flexGrow={1}
            sx={{
              overflow: 'hidden',
              borderTop: (theme) => `solid 1px ${theme.palette.divider}`,
            }}
          >
            <Stack flexGrow={1} sx={{ minWidth: 0 }}>
              {selectedConversation && (<ChatMessageList conversation={selectedConversation}  setCurrentConversation={setCurrentConversation}/>)}

              <ChatMessageInput
                conversationId={activeConversationId}
                onSend={handleSendMessage}
                disabled={
                  pathname === PATH_DASHBOARD.chat.root || pathname === PATH_DASHBOARD.chat.new
                }
              />
            </Stack>

            {detailView && selectedConversation &&(
              <ChatRoom conversation={selectedConversation} participants={displayParticipants} />
            )}
          </Stack>
        </Stack>
      </Card>
    </Container>
  );
}
