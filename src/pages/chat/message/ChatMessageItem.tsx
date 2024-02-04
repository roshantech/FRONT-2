import { formatDistanceToNowStrict } from 'date-fns';
import { HOST_API_KEY } from 'src/config-global';
import { useAuthContext } from 'src/auth/useAuthContext';
// @mui
import { Avatar, Typography, Stack } from '@mui/material';
// @types
import { IChatConversation, IChatMessage } from '../../../@types/chat';
// components
import Image from '../../../components/image';

// ----------------------------------------------------------------------

const CURRENT_USER_ID = '8864c717-587d-472a-929a-8e5f298024da-0';

type Props = {
  message: IChatMessage;
  conversation: IChatConversation;
  onOpenLightbox: (value: string) => void;
};

export default function ChatMessageItem({ message, conversation, onOpenLightbox }: Props) {
  const sender = conversation.Participants.find(
    (participant) => participant.ID === message.SenderID
  );
  const { user } = useAuthContext();

  const senderDetails =
    message.SenderID === user?.ID
      ? {
          type: 'me',
        }
      : {
          avatar: `${HOST_API_KEY}/${ sender?.ProfilePic}`,
          name: sender?.name,
        };

  const currentUser = senderDetails.type === 'me';

  const isImage = message.ContentType === 'image';

  const firstName = senderDetails.name && senderDetails.name.split(' ')[0];

  return (
    <Stack direction="row" justifyContent={currentUser ? 'flex-end' : 'unset'} sx={{ mb: 3 }}>
      {!currentUser && (
        <Avatar
          alt={senderDetails.name}
          src={senderDetails.avatar}
          sx={{ width: 32, height: 32, mr: 2 }}
        />
      )}

      <Stack spacing={1} alignItems="flex-end">
        <Typography
          noWrap
          variant="caption"
          sx={{
            color: 'text.disabled',
            ...(!currentUser && {
              mr: 'auto',
            }),
          }}
        >
          {!currentUser && `${firstName},`} &nbsp;
          {formatDistanceToNowStrict(new Date(message.CreatedAt), {
            addSuffix: true,
          })}
        </Typography>

        <Stack
          sx={{
            p: 1.5,
            minWidth: 48,
            maxWidth: 320,
            borderRadius: 1,
            overflow: 'hidden',
            typography: 'body2',
            bgcolor: 'background.neutral',
            ...(currentUser && {
              color: 'grey.800',
              bgcolor: 'primary.lighter',
            }),
            ...(isImage && {
              p: 0,
            }),
          }}
        >
          {isImage ? (
            <Image
              alt="attachment"
              src={message.Body}
              onClick={() => onOpenLightbox(message.Body)}
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  opacity: 0.9,
                },
              }}
            />
          ) : (
            message.Body
          )}
        </Stack>
      </Stack>
    </Stack>
  );
}
