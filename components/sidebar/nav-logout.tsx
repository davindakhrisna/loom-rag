import { signOut } from "@/auth"
import { LogOut } from "lucide-react"

const NavLogout = () => {
  return (
    <form
      action={async () => {
        "use server"
        await signOut()
      }}
    >
      <LogOut />
      <button type="submit">Logout</button>
    </form>
  )
}

export default NavLogout
