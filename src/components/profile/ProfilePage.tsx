import EmployeeProfile from "./EmployeeProfile.tsx"
import './ProfilePage.css'

const ProfilePage: React.FC = () =>{
  return(
    <div className="employee-page">
      <EmployeeProfile />
    </div>
  )
}

export default ProfilePage