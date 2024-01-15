// @mui
import { Grid, Stack } from '@mui/material';
import { useAuthContext } from 'src/auth/useAuthContext';
// @types
import { IUserProfile, IUserProfilePost } from '../../../@types/user';
//
import ProfileAbout from './ProfileAbout';
import ProfilePostCard from './ProfilePostCard';
import ProfilePostInput from './ProfilePostInput';
import ProfileFollowInfo from './ProfileFollowInfo';
import ProfileSocialInfo from './ProfileSocialInfo';

// ----------------------------------------------------------------------

type Props = {
  info: IUserProfile;
  posts: IUserProfilePost[];
};

export default function Profile({ info, posts }: Props) {
  const { user } = useAuthContext();
  console.log(user)
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

          {posts.map((post) => (
            <ProfilePostCard key={post.id} post={post} />
          ))}
        </Stack>
      </Grid>
    </Grid>
  );
}
