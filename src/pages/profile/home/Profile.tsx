import { useCallback, useEffect, useState } from 'react';
// @mui
import { Grid, Stack } from '@mui/material';
import { useAuthContext } from 'src/auth/useAuthContext';
import { useSnackbar } from 'src/components/snackbar';
import axiosInstance from 'src/utils/axios';
// @types
import { IUserProfile, IUserProfilePost, Post } from '../../../@types/user';
//
import ProfileAbout from './ProfileAbout';
import ProfilePostCard from './ProfilePostCard';
import ProfilePostInput from './ProfilePostInput';
import ProfileFollowInfo from './ProfileFollowInfo';
import ProfileSocialInfo from './ProfileSocialInfo';

// ----------------------------------------------------------------------

type Props = {
  info: IUserProfile;
};

export default function Profile({ info }: Props) {
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const [posts, setPosts] = useState<Post[]>([]);

  const getAllUserPost = useCallback(() => {
      axiosInstance
      .get(`/v1/core/getPosts`)
      .then((response) => {
        setPosts(response.data as Post[])
      })
      .catch((error) => {
        enqueueSnackbar('Something Went Wrong!', { variant: 'error' });
      });
  },[enqueueSnackbar]);

  useEffect(() => {
    try {
        getAllUserPost()
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Unable to logout', { variant: 'error' });
    }
  },[enqueueSnackbar, getAllUserPost])

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Stack spacing={3}>
          <ProfileFollowInfo follower={info.follower} following={info.following} />

          <ProfileAbout
            quote={user?.about}
            country={user?.address.country}
            email={user?.email}
            role={user?.role}
            company={user?.company}
            school={user?.education}
            phone={user?.phone_number}
          />

          <ProfileSocialInfo socialLinks={info.socialLinks} />
        </Stack>
      </Grid>

      <Grid item xs={12} md={8}>
        <Stack spacing={3}>
          <ProfilePostInput />

          {posts.length >0 && posts.map((post) => (
            <ProfilePostCard key={post.ID} post={post} />
          ))}
        </Stack>
      </Grid>
    </Grid>
  );
}
