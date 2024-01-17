import { useState, useRef, useEffect, useCallback } from 'react';
import { HOST_API_KEY } from 'src/config-global';
import axiosInstance from 'src/utils/axios';
// @mui
import EmojiPicker, { Theme } from 'emoji-picker-react';
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
import { useTheme } from '@mui/material/styles';

// ----------------------------------------------------------------------

interface Props {
  post: Post;
}

export default function ProfilePostCard({ post }: Props) {
  const { user } = useAuthContext();
  const commentInputRef = useRef<HTMLInputElement>(null);
  const theme = useTheme();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [type, setType] = useState<'image' | 'video' | null>(post.media_type);
  const [isLiked, setLiked] = useState(true);
  
  const [likes, setLikes] = useState(1);

  const [message, setMessage] = useState('');

  // const hasComments = post.comments.length > 0;
  const { enqueueSnackbar } = useSnackbar();
  const [postUser, setPostUser] = useState<any>();
  const [showPicker, setShowPicker] = useState<boolean>(false);

  
  const GetPostUser = useCallback(() => {
    try{
      console.log(post)
      axiosInstance
      .get(`/v1/core/getUserByID?ID=${post.user_id}`)
      .then((response) => {
        setPostUser(response.data)        
      })
      .catch((error) => {
        
        enqueueSnackbar('Something Went Wrong!', { variant: 'error' });
      });
    }catch(error){
      enqueueSnackbar('Something Went Wrong!', { variant: 'error' });
    }
  },[enqueueSnackbar,post]);
  useEffect(() => {
     GetPostUser()
  },[GetPostUser])

console.log(post)

  const handleLike = () => {
    setLiked(true);
    setLikes((prevLikes) => prevLikes + 1);
  };

  const handleUnlike = () => {
    setLiked(false);
    setLikes((prevLikes) => prevLikes - 1);
  };

  const handleChangeMessage = (value: string) => {
    setMessage(value);
  };

  const handleClickAttach = () => {
    const { current } = fileInputRef;
    if (current) {
      current.click();
    }
  };

  const handleClickComment = () => {
    const { current } = commentInputRef;
    if (current) {
      current.focus();
    }
  };
  interface PostMediaProps {
    typ: 'image' | 'video' | null;
  }
  
  const PostMedia: React.FC<PostMediaProps> = ({ typ }) => {
    let mediaComponent: JSX.Element | null = null;
  
    if (typ === 'image') {
      mediaComponent = (
        <Image alt="post media" src={ `${HOST_API_KEY}/${ post.media_url}`} ratio="16/9" sx={{ borderRadius: 1, mb: 2 }} />
      );
    } else if (typ === 'video') {
      mediaComponent = (
        <ReactPlayer url={`${HOST_API_KEY}/${ post.media_url}`}  controls width="100%" height="auto" style={{ marginBottom: 2 }} />
      );
    }
  
    return mediaComponent;
  };



  return (
    <Card>
      <CardHeader
        disableTypography
        avatar={
          <CustomAvatar src={`${HOST_API_KEY}/${ postUser?.ProfilePic}`} alt={postUser?.username} name={postUser?.username} />
        }
        title={
          <Link color="inherit" variant="subtitle2">
            {postUser?.username}
          </Link>
        }
        subheader={
          <Typography variant="caption" component="div" sx={{ color: 'text.secondary' }}>
            {fDate(post.createdAt)}
          </Typography>
        }
        action={
          <IconButton>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        }
      />

      <Typography
        sx={{
          p: (theme) => theme.spacing(3, 3, 2, 3),
        }}
      >
        {post.caption}
      </Typography>

      <Box sx={{ p: 1 }}>
          <PostMedia typ={type} />
      </Box>

      <Stack
        direction="row"
        alignItems="center"
        sx={{
          p: (theme) => theme.spacing(2, 3, 3, 3),
        }}
      >
        <FormControlLabel
          control={
            <Checkbox
              color="error"
              checked={isLiked}
              icon={<Iconify icon="eva:heart-fill" />}
              checkedIcon={<Iconify icon="eva:heart-fill" />}
              onChange={isLiked ? handleUnlike : handleLike}
            />
          }
          label={fShortenNumber(likes)}
        />

        {/* <CustomAvatarGroup>
          {post.likes.map((person) => (
            <CustomAvatar key={person.name} alt={person.name} src={person.avatarUrl} />
          ))}
        </CustomAvatarGroup> */}

        <Box sx={{ flexGrow: 1 }} />

        <IconButton onClick={handleClickComment}>
          <Iconify icon="eva:message-square-fill" />
        </IconButton>

        <IconButton>
          <Iconify icon="eva:share-fill" />
        </IconButton>
      </Stack>

      {/* {hasComments && (
        <Stack spacing={1.5} sx={{ px: 3, pb: 2 }}>
          {post.comments.map((comment) => (
            <Stack key={comment.id} direction="row" spacing={2}>
              <CustomAvatar alt={comment.author.name} src={comment.author.avatarUrl} />

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
                  <Typography variant="subtitle2">{comment.author.name}</Typography>

                  <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                    {fDate(comment.createdAt)}
                  </Typography>
                </Stack>

                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {comment.message}
                </Typography>
              </Paper>
            </Stack>
          ))}
        </Stack>
      )} */}

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
          value={message}
          inputRef={commentInputRef}
          placeholder="Write a comment…"
          onChange={(event) => handleChangeMessage(event.target.value)}
          endAdornment={
            <InputAdornment position="end" sx={{ mr: 1 }}>
              {showPicker && (<EmojiPicker style={{bottom:250,left:70,position:"relative"}} /> )}
              <IconButton size="small" onClick={handleClickAttach}>
                <Iconify icon="ic:round-add-photo-alternate" />
              </IconButton>

              <IconButton size="small" onClick={() => {setShowPicker(!showPicker)}}>
                <Iconify icon="eva:smiling-face-fill" />
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
    </Card>
  );
}
