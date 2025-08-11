import ProfilePage from '@/components/profile/profile';
import { auth } from "@/auth"

const Profile = async () => {
  const session = await auth()

  return (
    <ProfilePage session={session} />
  )
}

export default Profile
