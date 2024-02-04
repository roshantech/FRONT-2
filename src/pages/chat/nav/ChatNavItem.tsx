import { formatDistanceToNowStrict } from 'date-fns';
import { useAuthContext } from 'src/auth/useAuthContext';
import { HOST_API_KEY } from 'src/config-global';
// @mui
import {
  Badge,
  Stack,
  Typography,
  ListItemText,
  ListItemButton,
  ListItemAvatar,
} from '@mui/material';
// @types
import { IChatConversation } from '../../../@types/chat';
// components
import { CustomAvatar, CustomAvatarGroup } from '../../../components/custom-avatar';
import BadgeStatus from '../../../components/badge-status';

// ----------------------------------------------------------------------

const CURRENT_USER_ID = '8864c717-587d-472a-929a-8e5f298024da-0';

type Props = {
  conversation: IChatConversation;
  openNav: boolean;
  isSelected: boolean;
  onSelect: VoidFunction;
};

export default function ChatNavItem({ conversation, openNav, isSelected, onSelect }: Props) {
  const { user } = useAuthContext();

  const details = getDetails(conversation, user?.ID);
  console.log(details)
  const lastActivity = conversation.Messages[conversation.Messages.length - 1].CreatedAt;

  const isGroup = details.otherParticipants.length > 1;
  const isUnread = conversation.UnreadCount > 0;

  const hasOnlineInGroup =
    isGroup && details.otherParticipants.map((item : any) => item.status).includes('online');

  return (
    <ListItemButton
      disableGutters
      onClick={onSelect}
      sx={{
        py: 1.5,
        px: 2.5,
        ...(isSelected && {
          bgcolor: 'action.selected',
        }),
      }}
    >
      <ListItemAvatar>
        {isGroup ? (
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={hasOnlineInGroup && <BadgeStatus status="online" />}
          >
            <CustomAvatarGroup compact sx={{ width: 48, height: 48 }}>
              {details.otherParticipants.slice(0, 2).map((participant) => (
                <CustomAvatar
                  key={participant.ID.toString()}
                  alt={participant.username}
                  src={`${HOST_API_KEY}/${ participant.ProfilePic}`  }
                />
              ))}
            </CustomAvatarGroup>
          </Badge>
        ) : (
          <CustomAvatar
            key={details.otherParticipants[0].ID.toString()}
            alt={details.otherParticipants[0].username}
            src={`${HOST_API_KEY}/${ details.otherParticipants[0].ProfilePic}` }
            BadgeProps={{
              badgeContent: <BadgeStatus status={details.otherParticipants[0].active? "active" : "unactive"} />,
            }}
            sx={{ width: 48, height: 48 }}
          />
        )}
      </ListItemAvatar>

      {openNav && (
        <>
          <ListItemText
            primary={details.displayNames}
            primaryTypographyProps={{ noWrap: true, variant: 'subtitle2' }}
            secondary={details.displayText}
            secondaryTypographyProps={{
              noWrap: true,
              variant: isUnread ? 'subtitle2' : 'body2',
              color: isUnread ? 'text.primary' : 'text.secondary',
            }}
          />

          <Stack alignItems="flex-end" sx={{ ml: 2, height: 44 }}>
            <Typography
              noWrap
              variant="body2"
              component="span"
              sx={{
                mb: 1.5,
                fontSize: 12,
                color: 'text.disabled',
              }}
            >
              {formatDistanceToNowStrict(new Date(lastActivity), {
                addSuffix: false,
              })}
            </Typography>

            {isUnread && <BadgeStatus status="unread" size="small" />}
          </Stack>
        </>
      )}
    </ListItemButton>
  );
}

// ----------------------------------------------------------------------

const getDetails = (conversation: IChatConversation, currentUserId: string) => {
  const otherParticipants = conversation.Participants.filter(
    (participant) => participant.ID.toString() !== currentUserId.toString()
  );

  const displayNames = otherParticipants.map((participant) => participant.username).join(', ');

  let displayText = '';
  if(conversation.Messages?.length !== 0){
    const lastMessage = conversation.Messages[conversation.Messages.length - 1];

    if (lastMessage) {
      const sender = lastMessage.SenderID.toString() === currentUserId ? 'You: ' : '';
      
      const message = lastMessage.ContentType === 'image' ? 'Sent a photo' : lastMessage.Body;
      
      displayText = `${sender}${message}`;
    }
  }
  
  return { otherParticipants, displayNames, displayText };
};
