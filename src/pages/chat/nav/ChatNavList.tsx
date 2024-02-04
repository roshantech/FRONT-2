import { useNavigate } from 'react-router-dom';
import { useAuthContext } from 'src/auth/useAuthContext';
// @mui
import { List, SxProps } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useResponsive from '../../../hooks/useResponsive';
// @types
import { IChatConversation, IChatConversationsState } from '../../../@types/chat';
// components
import { SkeletonConversationItem } from '../../../components/skeleton';
//
import ChatNavItem from './ChatNavItem';

// ----------------------------------------------------------------------


type Props = {
  conversations: IChatConversation[];
  openNav: boolean;
  onCloseNav: VoidFunction;
  selected: (conversationId: string) => boolean;
  setCurrentConversation:(consersation: IChatConversation) => void,
  sx?: SxProps;
};

export default function ChatNavList({
  conversations,
  openNav,
  onCloseNav,
  selected,
  setCurrentConversation,
  sx,
  ...other
}: Props) {
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const isDesktop = useResponsive('up', 'md');

  const handleSelectConversation = (conversationId: string) => {
    let conversationKey = '';

    const conversation =  conversations.find(conversatio => conversatio.ID.toString() === conversationId);

    if (conversation?.Type === 'GROUP') {
      conversationKey = conversation?.ID.toString();
    } else {
      const otherParticipant = conversation?.Participants.find(
        (participant) => participant.ID.toString() !== user?.ID
      );

      if (otherParticipant?.username) {
        conversationKey = otherParticipant?.username;
      }
    }

    navigate(PATH_DASHBOARD.chat.view(conversationKey));
  };

  const loading = !conversations.length;

  return (
    <List disablePadding sx={sx} {...other}>
      {conversations.map((conversation, index) =>
        conversation.ID ? (
          <ChatNavItem
            key={conversation.ID}
            openNav={openNav}
            conversation={conversation}
            isSelected={selected(conversation.ID.toString())}
            onSelect={() => {
              if (!isDesktop) {
                onCloseNav();
              }
              setCurrentConversation(conversation);
            }}
          />
        ) : (
          <SkeletonConversationItem key={index} />
        )
      )}
    </List>
  );
}
