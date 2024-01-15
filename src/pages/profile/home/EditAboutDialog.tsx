// @mui
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import {
  Dialog,
  Button,
  DialogProps,
  DialogTitle,
  DialogActions,
  DialogContent,
  Stack,
  Typography,
  Link,
  TextField,
} from '@mui/material';
import { useSnackbar } from 'src/components/snackbar';
import { styled } from '@mui/material/styles';
import { useForm } from 'react-hook-form';
import FormProvider from 'src/components/hook-form/FormProvider';
import Iconify from 'src/components/iconify';
import { RHFTextField } from 'src/components/hook-form';
import axiosInstance from 'src/utils/axios';
import { useAuthContext } from 'src/auth/useAuthContext';
// @types

// ----------------------------------------------------------------------

interface Props extends DialogProps {
 
  open: boolean;
  onClose: VoidFunction;
  payload:any;
}

const StyledIcon = styled(Iconify)(({ theme }) => ({
  width: 20,
  height: 20,
  marginTop: 1,
  flexShrink: 0,
  marginRight: theme.spacing(2),
}));

type FormValuesProps = {
  About: string;
  Country: string;
  Email: string;
  PhoneNo:string;
  Company:string;
  School:string;
};
export default function FileShareDialog({
  
  //
  open,
  payload,
  onClose,
  ...other
}: Props) {
  const { user ,initialize} = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();

  const LoginSchema = Yup.object().shape({
    About: Yup.string().required('Email is required'),
    Country: Yup.string().required('Password is required'),
    Email: Yup.string().required('Password is required').email('Email must be a valid email address'),
    PhoneNo: Yup.string().required('Password is required'),
    Company: Yup.string().required('Password is required'),
    School: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    About: payload.quote,
    Country: payload.country,
    Email:payload.email,
    PhoneNo:payload.phone,
    Company:payload.company,
    School:payload.school,
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = methods;
  
  const onSubmit = async (data: FormValuesProps) => {
    try {
      console.log(data)
      axiosInstance
      .post(`/v1/core/updateProfile?ID=${user?.ID}`,data)
      .then((response) => {
        enqueueSnackbar(response.data);
        initialize()
        onClose()
      })
      .catch((error) => {
        console.error('Error fetching getJobFile:', error);
        enqueueSnackbar('Something went wrong!', { variant: 'error' });

      });
    } catch (error) {
      console.error(error);

      reset();

      // setError('afterSubmit', {
      //   ...error,
      //   message: error.message || error,
      // });
    }
  };
  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose} {...other}>
      <DialogTitle> Edit About </DialogTitle>

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <DialogContent sx={{ overflow: 'unset' }}>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Stack direction="row"> 
          <StyledIcon icon="mdi:about" />
          <Typography variant="body2" sx={{width:"100%"}}>
            About &nbsp;
           <RHFTextField name="About" label="About" variant="standard" fullWidth/>

          </Typography>
        </Stack>
        <Stack direction="row">
          <StyledIcon icon="eva:pin-fill" />

          <Typography variant="body2" sx={{width:"100%"}}>
            Live at &nbsp;
           
           
            <RHFTextField name="Country" label="Country" variant="standard"/>

          </Typography>
        </Stack>

        <Stack direction="row">
          <StyledIcon icon="eva:email-fill" />
          
            <RHFTextField name="Email" label="Email" variant="standard"/>

        </Stack>

        <Stack direction="row">
          <StyledIcon icon="mingcute:phone-fill" />

          <Typography variant="body2" sx={{width:"100%"}}>
            Phone no &nbsp;
          
            <RHFTextField name="PhoneNo" label="PhoneNo" variant="standard"/>

          </Typography>
        </Stack>

        <Stack direction="row">
          <StyledIcon icon="ic:round-business-center" />

          <Typography variant="body2" sx={{width:"100%"}}>
            {payload.role} at &nbsp;
       
           
            <RHFTextField name="Company" label="Company" variant="standard"/>

          </Typography>
        </Stack>

        <Stack direction="row">
          <StyledIcon icon="streamline:quality-education-solid" />

          <Typography variant="body2" sx={{width:"100%"}}>
            Studied at &nbsp;
            
            
            <RHFTextField name="School" label="School" variant="standard"/>

          </Typography>
        </Stack>
      </Stack>

      </DialogContent>

      <DialogActions sx={{ justifyContent: 'space-between' }}>
       

        {onClose && (
          <Button variant="outlined" color="inherit" onClick={onClose}>
            Close
          </Button>
          
          )}
        <Button variant="outlined" color="primary"  type='submit' >
            Update
          </Button>
      </DialogActions>
          </FormProvider>
    </Dialog>
  );
}
