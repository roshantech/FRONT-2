// @mui
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import axiosInstance from 'src/utils/axios';
import { Box, Typography } from '@mui/material';
// @types
import { IUserProfileCover } from '../../@types/user';
// utils
import { bgBlur } from '../../utils/cssStyles';
// auth
import { useAuthContext } from '../../auth/useAuthContext';
// components
import Image from '../../components/image';
import { CustomAvatar } from '../../components/custom-avatar';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  '&:before': {
    ...bgBlur({
      color: theme.palette.primary.darker,
    }),
    top: 0,
    zIndex: 9,
    content: "''",
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
}));

const StyledInfo = styled('div')(({ theme }) => ({
  left: 0,
  right: 0,
  zIndex: 99,
  position: 'absolute',
  marginTop: theme.spacing(5),
  [theme.breakpoints.up('md')]: {
    right: 'auto',
    display: 'flex',
    alignItems: 'center',
    left: theme.spacing(3),
    bottom: theme.spacing(3),
  },
}));

// ----------------------------------------------------------------------

export default function ProfileCover({ name, role, cover }: IUserProfileCover) {
  const { user } = useAuthContext();
  const [profilepic, setProfilePic] = useState<string>("");
  
  useEffect(() => {
    try {
      if (user){
        console.log(user)
        handleFileOpen(user.ProfilePic)
      }
    } catch (error) {
      console.error(error);
    }
  },[user])

  const handleFileOpen = (loc: any) => {
    axiosInstance
      .get(`/v1/core/getProfilePic?loc=${loc}`, {
        responseType: 'blob',
      })
      .then((response) => {
        const blob = response.data;
        const objectUrl = URL.createObjectURL(blob);
        setProfilePic(objectUrl)
      })
      .catch((error) => {
        console.error('Error fetching getJobFile:', error);
      });
  };
  return (
    <StyledRoot>
      <StyledInfo>
        <CustomAvatar
          src={profilepic}
          alt={user?.username}
          name={user?.username}
          sx={{
            mx: 'auto',
            borderWidth: 2,
            borderStyle: 'solid',
            borderColor: 'common.white',
            width: { xs: 80, md: 128 },
            height: { xs: 80, md: 128 },
          }}
        />

        <Box
          sx={{
            ml: { md: 3 },
            mt: { xs: 1, md: 0 },
            color: 'common.white',
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          <Typography variant="h4">{name}</Typography>

          <Typography sx={{ opacity: 0.72 }}>{role}</Typography>
        </Box>
      </StyledInfo>

      <Image
        alt="cover"
        src={cover}
        sx={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          position: 'absolute',
        }}
      />
    </StyledRoot>
  );
}
