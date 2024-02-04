import { useRef, useState } from 'react';
import { useAuthContext } from 'src/auth/useAuthContext';
// @mui
import { Stack, InputBase, InputBaseProps, IconButton, InputAdornment } from '@mui/material';
// utils
import uuidv4 from '../../../utils/uuidv4';
// @types
import { IChatSendMessage } from '../../../@types/chat';
// components
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------


interface Props extends InputBaseProps {
  conversationId: string | null;
  onSend: (data: IChatSendMessage) => void;
}

export default function ChatMessageInput({
  disabled,
  conversationId,
  onSend,
  sx,
  ...other
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuthContext();

  const [message, setMessage] = useState('');

  const handleClickAttach = () => {
    fileInputRef.current?.click();
  };

  const handleSend = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (onSend && message && conversationId) {
        onSend({
          conversationId,
          messageId: uuidv4(),
          message,
          contentType: 'text',
          attachments: [],
          createdAt: new Date(),
          senderId: user?.ID,
        });
      }
      setMessage('');
    }
  };

  return (
    <>
      <InputBase
        value={message}
        onKeyUp={handleSend}
        onChange={(event) => setMessage(event.target.value)}
        placeholder="Type a message"
        startAdornment={
          <InputAdornment position="start">
            <IconButton size="small">
              <Iconify icon="eva:smiling-face-fill" />
            </IconButton>
          </InputAdornment>
        }
        endAdornment={
          <Stack direction="row" spacing={1} sx={{ mr: 1.5 }}>
            <IconButton disabled={disabled} size="small" sx={{cursor:"pointer"}} onClick={handleClickAttach}>
              <Iconify icon="ic:round-add-photo-alternate" />
            </IconButton>

            <IconButton disabled={disabled} size="small" onClick={handleClickAttach}>
              <Iconify icon="eva:attach-2-fill" />
            </IconButton>

            <IconButton disabled={disabled} size="small">
              <Iconify icon="eva:mic-fill" />
            </IconButton>
          </Stack>
        }
        sx={{
          pl: 1,
          height: 56,
          flexShrink: 0,
          borderTop: (theme) => `solid 1px ${theme.palette.divider}`,
          ...sx,
        }}
        {...other}
      />

      <input type="file" ref={fileInputRef}   style={{ display: 'none' }} />
    </>
  );
}
