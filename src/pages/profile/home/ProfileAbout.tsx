import { useState } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Link, Card, Typography, CardHeader, Stack, Button } from '@mui/material';
// @types
import { IUserProfileAbout } from '../../../@types/user';
// components
import Iconify from '../../../components/iconify';
import EditAboutDialog from './EditAboutDialog';

// ----------------------------------------------------------------------

const StyledIcon = styled(Iconify)(({ theme }) => ({
  width: 20,
  height: 20,
  marginTop: 1,
  flexShrink: 0,
  marginRight: theme.spacing(2),
}));

// ----------------------------------------------------------------------

export default function ProfileAbout({
  quote,
  country,
  email,
  role,
  company,
  school,
  phone,
}: IUserProfileAbout) {
  const [openEdit, setOpenEditAbout] = useState(false);

  const handleOpenFrom = () => {
    setOpenEditAbout(true)
  }

  const handleCloseFrom = () => {
    setOpenEditAbout(false)
  }
  const payload = {
    quote,
    country,
    email,
    role,
    company,
    school,
    phone,
  }
  return (
    <Card>
      <CardHeader title="About"   action={
          <Button size="small" startIcon={<Iconify icon="eva:edit-fill" />} onClick={handleOpenFrom} > Change </Button>
        }/>
        <EditAboutDialog
          onClose={() => {
            handleCloseFrom();
          } } 
          payload={payload}
          open={openEdit} 
        />
      <Stack spacing={2} sx={{ p: 3 }}>
        <Typography variant="body2">{quote}</Typography>

        <Stack direction="row">
          <StyledIcon icon="eva:pin-fill" />

          <Typography variant="body2">
            Live at &nbsp;
            <Link component="span" variant="subtitle2" color="text.primary">
              {country}
            </Link>
          </Typography>
        </Stack>

        <Stack direction="row">
          <StyledIcon icon="eva:email-fill" />
          <Typography variant="body2">{email}</Typography>
        </Stack>
        <Stack direction="row">
          <StyledIcon icon="mingcute:phone-fill" />

          <Typography variant="body2">
            Phone no &nbsp;
            <Link component="span" variant="subtitle2" color="text.primary">
              {phone}
            </Link>
          </Typography>
        </Stack>

        <Stack direction="row">
          <StyledIcon icon="ic:round-business-center" />

          <Typography variant="body2">
            {role} at &nbsp;
            <Link component="span" variant="subtitle2" color="text.primary">
              {company}
            </Link>
          </Typography>
        </Stack>

        <Stack direction="row">
          <StyledIcon icon="streamline:quality-education-solid" />

          <Typography variant="body2">
            Studied at &nbsp;
            <Link component="span" variant="subtitle2" color="text.primary">
              {school}
            </Link>
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
