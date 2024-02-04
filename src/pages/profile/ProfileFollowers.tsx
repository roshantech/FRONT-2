import { useCallback, useEffect, useState } from 'react';
import { HOST_API_KEY } from 'src/config-global';
import { useAuthContext } from 'src/auth/useAuthContext';
import axiosInstance from 'src/utils/axios';
import { useSnackbar } from 'src/components/snackbar';
// @mui
import { Box, Card, Button, Avatar, Typography, Stack } from '@mui/material';
// @types
import { IUserProfileFollower } from '../../@types/user';
// components
import Iconify from '../../components/iconify';

// ----------------------------------------------------------------------

type Props = {
  followers: IUserProfileFollower[];
};

export default function ProfileFollowers() {
  const { user } = useAuthContext();

  const [followers, setFollowers] = useState<any[]>([]);
  const { enqueueSnackbar } = useSnackbar();
  const GetUserFollowers = useCallback(() => {
    try{
      axiosInstance
      .get(`/v1/core/getAllUsers`)
      .then((response) => {
        setFollowers(response.data)
        console.log(response.data)
      })
      .catch((error) => {
        
        enqueueSnackbar('Something Went Wrong!', { variant: 'error' });
      });
    }catch(error){
      enqueueSnackbar('Something Went Wrong!', { variant: 'error' });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  useEffect(() => {
    GetUserFollowers()
  },[GetUserFollowers])
  return (
    <>
      <Typography variant="h4" sx={{ my: 5 }}>
        Followers
      </Typography>

      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
      >
        {followers && followers.map((follower) => (
          <FollowerCard key={follower.FollowerID} follower={follower}  user={user}/>
        ))}
      </Box>
    </>
  );
}

// ----------------------------------------------------------------------

type FollowerCardProps = {
  follower: any;
  user:any;
};

function FollowerCard({ follower ,user}: FollowerCardProps) {
  const { username,ID, ProfilePic ,address} = follower;
  console.log(user)
  const [toggle, setToogle] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  // useEffect(() => {
  //   if(user.follower.followerID === ID){
  //     setToogle(true)
  //   }
  // }, [user.ID, ID])
  const GetUserFollowers = () => {
    try{
      axiosInstance
      .get(`/v1/core/addFollowerToUser?FID=${ID}`)
      .then((response) => {
        console.log(response.data)
        setToogle(true)
      })
      .catch((error) => {
        setToogle(false)
        enqueueSnackbar('Something Went Wrong!', { variant: 'error' });
      });
    }catch(error){
      enqueueSnackbar('Something Went Wrong!', { variant: 'error' });
    }
  }

  return (
    <Card
      sx={{
        p: 3,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Avatar alt={username} src={`${HOST_API_KEY}/${ ProfilePic}`} sx={{ width: 48, height: 48 }} />

      <Box
        sx={{
          pl: 2,
          pr: 1,
          flexGrow: 1,
          minWidth: 0,
        }}
      >
        <Typography variant="subtitle2" noWrap>
          {username}
        </Typography>

        <Stack spacing={0.5} direction="row" alignItems="center" sx={{ color: 'text.secondary' }}>
          <Iconify icon="eva:pin-fill" width={16} sx={{ flexShrink: 0 }} />

          <Typography variant="body2" component="span" noWrap>
            {address.country}
          </Typography>
        </Stack>
      </Box>

      <Button
        size="small"
        onClick={() => GetUserFollowers()}
        variant={toggle ? 'text' : 'outlined'}
        color={toggle ? 'primary' : 'inherit'}
        startIcon={toggle && <Iconify icon="eva:checkmark-fill" />}
        sx={{ flexShrink: 0 }}
      >
        {toggle ? 'Followed' : 'Follow'}
      </Button>
    </Card>
  );
}
