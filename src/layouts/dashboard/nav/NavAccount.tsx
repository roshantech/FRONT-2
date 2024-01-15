// @mui
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from 'src/utils/axios';
import { styled, alpha } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import { useSnackbar } from 'src/components/snackbar';
// auth
// components
import { CustomAvatar } from '../../../components/custom-avatar';
import { useAuthContext } from '../../../auth/useAuthContext';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12),
}));

// ----------------------------------------------------------------------

export default function NavAccount() {
  const { user } = useAuthContext();
  const [profilepic, setProfilePic] = useState<string>("");
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    try {
      if (user){
        console.log(user)
        handleFileOpen(user.ProfilePic)
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Unable to logout', { variant: 'error' });
    }
  },[enqueueSnackbar,user])

  const navigate = useNavigate();

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
    <StyledRoot onClick={() => {navigate('userprofile')}}>
      <CustomAvatar src={profilepic} alt={user?.username} name={user?.username} />

      <Box sx={{ ml: 2, minWidth: 0 }} >
        <Typography variant="subtitle2" noWrap>
          {user?.username}
        </Typography>

        <Typography variant="body2" noWrap sx={{ color: 'text.secondary' }}>
          {user?.role}
        </Typography>
      </Box>
    </StyledRoot>
  );
}
