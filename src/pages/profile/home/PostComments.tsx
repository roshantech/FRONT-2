import { useState, useRef, useEffect, useCallback } from 'react';
import { HOST_API_KEY } from 'src/config-global';
import axiosInstance from 'src/utils/axios';
// @mui
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react';
import { alpha } from '@mui/material/styles';
import { useSnackbar } from 'src/components/snackbar';
import ReactPlayer from 'react-player';
import {
  Box,
  Link,
  Card,
  Stack,
  Paper,
  Checkbox,
  InputBase,
  Typography,
  CardHeader,
  IconButton,
  InputAdornment,
  FormControlLabel,
} from '@mui/material';
// @types
import { IUserProfilePost, Post } from '../../../@types/user';
// auth
import { useAuthContext } from '../../../auth/useAuthContext';
// utils
import { fDate } from '../../../utils/formatTime';
import { fShortenNumber } from '../../../utils/formatNumber';
// components
import Image from '../../../components/image';
import Iconify from '../../../components/iconify';
import { CustomAvatar, CustomAvatarGroup } from '../../../components/custom-avatar';

// ----------------------------------------------------------------------

interface Props {
    post: Post;
}

export default function ProfileComments({ post }: Props) {
  const { user } = useAuthContext();
  const commentInputRef = useRef<HTMLInputElement>(null);
  const [comments, setComments] = useState<any>([]);
  const [page, setPage] = useState<any>(1);
  const { enqueueSnackbar } = useSnackbar();
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const GetPostComments = useCallback(() => {
    try{
      axiosInstance
      .get(`/v1/core/getPostComments?postId=${post.ID}&page=${page}`)
      .then((response) => {
        setComments([ ...comments,...response.data])

        // setPage(page + 1)     
      })
      .catch((error) => {
        
        enqueueSnackbar('Something Went Wrong!', { variant: 'error' });
      });
    }catch(error){
      enqueueSnackbar('Something Went Wrong!', { variant: 'error' });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[ enqueueSnackbar, post,page]);

  useEffect(() => {
    GetPostComments()
  },[GetPostComments])
  const handleScroll = (event:any) => {
    const { scrollTop, scrollHeight, clientHeight } = event.target;

    const isAtBottom = scrollTop + clientHeight === scrollHeight;
    if(isAtBottom){
      console.log(isAtBottom)
      setPage(page + 1)   
    }

  };
  const [message, setMessage] = useState('');

  const handleEmojiSelect = (selectedEmoji:EmojiClickData ,e:any) => {
    if(commentInputRef.current != null){
      commentInputRef.current.value += selectedEmoji.emoji
    }
  };

  const createComment = () => {
    const data = new FormData();
    data.append("post_id" , post.ID.toString() )
    data.append("message" ,commentInputRef.current?.value as string)
    console.log(commentInputRef.current)
    axiosInstance
    .post(`/v1/core/createPostComments` , data)
    .then((response) => {
        enqueueSnackbar('Sucessfully Commented!');
        if(commentInputRef.current != null){
          commentInputRef.current.value = ""
        }
      }).catch((error) => {
        enqueueSnackbar('Something Went Wrong!', { variant: 'error' });
      });      
  }

  const handleClickAttach = () => {
    const { current } = fileInputRef;
    if (current) {
      current.click();
    }
  };

return (
  <>
        <Stack spacing={1.5} sx={{ px: 3, pb: 2 , mb:2,mt:2, maxHeight: 200, overflow: 'auto'}} onScroll={handleScroll}>
          {comments.map((comment:any) => (
            <Stack key={comment.ID} direction="row" spacing={2} >
              <CustomAvatar alt={comment.username} src={`${HOST_API_KEY}/${ comment?.ProfilePic}`} />
              <Paper
                sx={{
                  p: 1.5,
                  flexGrow: 1,
                  bgcolor: 'background.neutral',
                }}
              >
                <Stack
                  justifyContent="space-between"
                  direction={{ xs: 'column', sm: 'row' }}
                  alignItems={{ sm: 'center' }}
                  sx={{ mb: 0.5 }}
                >
                  <Typography variant="subtitle2">{comment.username}</Typography>

                  <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                    {fDate(comment.CreatedAt)}
                  </Typography>
                </Stack>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {comment.message}
                </Typography>
              </Paper>
            </Stack>
          ))}
        </Stack>
      <Stack
      spacing={2}
      direction="row"
      alignItems="center"
      sx={{
        p: (theme) => theme.spacing(0, 3, 3, 3),
      }}
    >
      <CustomAvatar src={`${HOST_API_KEY}/${ user?.ProfilePic}`} alt={user?.username} name={user?.username} />

      <InputBase
        fullWidth
        // value={message}
        inputRef={commentInputRef}
        placeholder="Write a comment…"
        endAdornment={
          <InputAdornment position="end" sx={{ mr: 1 }}>
            {showPicker && (<EmojiPicker style={{bottom:250,left:70,position:"relative",zIndex:10}} theme={"dark" as Theme } lazyLoadEmojis onEmojiClick={handleEmojiSelect}/> )}
            <IconButton size="small" onClick={handleClickAttach}>
              <Iconify icon="ic:round-add-photo-alternate" />
            </IconButton>

            <IconButton size="small" onClick={() => {setShowPicker(!showPicker)}}>
              <Iconify icon="eva:smiling-face-fill" />
            </IconButton>

            <IconButton size="small">
              <Iconify icon="majesticons:send"  onClick={() => {createComment()}}/>
            </IconButton>
              
          </InputAdornment>
        }
        sx={{
          pl: 1.5,
          height: 40,
          borderRadius: 1,
          border: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.32)}`,
        }}
      />
      <input type="file" ref={fileInputRef} style={{ display: 'none' }} />

    </Stack>
    </>
  );
}
