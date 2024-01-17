import { useRef, useState } from 'react';
// @mui
import { useSnackbar } from 'src/components/snackbar';
import axiosInstance from 'src/utils/axios';

import { alpha } from '@mui/material/styles';
import { Card, Button, Fab, Stack, InputBase } from '@mui/material';
// components
import ReactPlayer from 'react-player'
import Iconify from '../../../components/iconify';
import Image from '../../../components/image';
// ----------------------------------------------------------------------

export default function ProfilePostInput() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [media, setMediaLink] = useState<string>("");
  const [typ, setType] = useState<'image' | 'video' | null>(null);
  const [caption, setCaption] = useState<string>("");
  const [File, setFile] = useState<any>(null);
  const { enqueueSnackbar } = useSnackbar();
  const videoRef = useRef(null);
  const handleClickAttach = () => {
    fileInputRef.current?.click();
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    console.log(selectedFile)
    if (selectedFile) {
      const isImage = selectedFile.type.startsWith('image/');
      const isVideo = selectedFile.type.startsWith('video/');

      if (isImage || isVideo) {
        setType(isImage ? 'image' : 'video');
        
        setFile(selectedFile)
        setMediaLink(URL.createObjectURL(selectedFile));
      } else {
        alert('Please select a valid image or video file.');
      }
    }
  };

  const onSubmit = () => {
    try{
      if (caption === "") {
        enqueueSnackbar('Caption is Empty!', { variant: 'error' });
        return 
      }
      const data = new FormData();

      data.append("caption" , caption)
      data.append("media_type" ,typ as string)

      if (File != null) {
        data.append("file" ,File)
      }else if(File?.name.includes(" ")){
        return ;
      }

      axiosInstance
      .post(`/v1/core/createPost`,data)
      .then((response) => {
        setFile(null)
        setMediaLink("")
        setCaption("")
        setType(null)
        enqueueSnackbar(response.data);
      })
      .catch((error) => {
        
        enqueueSnackbar('Something Went Wrong!', { variant: 'error' });
      });
    }catch(error){
      enqueueSnackbar('Something Went Wrong!', { variant: 'error' });
    }
  };
  interface PostMediaProps {
    type: 'image' | 'video' | null;
    mediaLink: string;
  }
  
  const PostMedia: React.FC<PostMediaProps> = ({ type, mediaLink }) => {
    let mediaComponent: JSX.Element | null = null;
  
    if (type === 'image') {
      mediaComponent = (
        <Image alt="post media" src={mediaLink} ratio="16/9" sx={{ borderRadius: 1, mb: 2 }} />
      );
    } else if (type === 'video') {
      mediaComponent = (
        <ReactPlayer url={mediaLink} ref={videoRef} controls width="100%" height="auto" style={{ marginBottom: 2 }} />
      );
    }
  
    return mediaComponent;
  };

  return (
    <Card sx={{ p: 3 }}>
       <InputBase
        multiline
        fullWidth
        rows={4}
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="Share what you are thinking here..."
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 1,
          border: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.32)}`,
        }}
      />
      
      {/* {type === 'image' ? (
        <Image alt="post media" src={mediaLink} ratio="16/9" sx={{ borderRadius: 1 ,mb:2}} />
      ) : type === 'video' ? (
        <ReactPlayer url={mediaLink} ref={videoRef} controls width="100%" height="auto" style={{ marginBottom: 2 }} />
       
      ) : null} */}

      <PostMedia type={typ} mediaLink={media} />


      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'text.secondary' }}>
          <Fab size="small" color="inherit" variant="softExtended" onClick={handleClickAttach}>
            <Iconify icon="ic:round-perm-media" width={24} sx={{ color: 'success.main' }} />
            Image/Video
          </Fab>
        </Stack>
        <Button variant="contained" onClick={() => {onSubmit()}}>Post</Button>
      </Stack>

      <input
        ref={fileInputRef}
        type="file"
        style={{ display: 'none' }}
        accept="image/*, video/*"
        onChange={handleFileChange}
      />
    </Card>
  );
}
