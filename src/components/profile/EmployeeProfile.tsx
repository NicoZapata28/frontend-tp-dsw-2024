import React, { useEffect, useState } from 'react'
import './EmployeeProfile.css'
import employee from '../../img/employee.svg'
import { jwtDecode } from 'jwt-decode'

interface Profile {
  name: string
  role: 'Empleado' | 'Administrador'
}

interface DecodedToken {
  id: string
  cuil: string
  name: string
  exp: number
  role: string
}

const EmployeeProfile: React.FC = () => {
    const [profile, setProfile] = useState<Profile | null>(null)

    useEffect(() => {
        const token = localStorage.getItem('token')
        
        if (token) {
            try {
                const decodedToken = jwtDecode<DecodedToken>(token)
                const name = decodedToken.name
                const role = decodedToken.role === 'E' ? 'Empleado' : 'Administrador'

                setProfile({ name, role });
            } catch (error) {
                console.error('Error decoding token:', error)
            }
        }
    }, [])

    if (!profile) {
        return <p>Cargando perfil...</p>
    }

    return (
        <div className="employee-profile">
            <img src={employee} alt="Empleado" className="profile-icon" />
            <h2 className="employee-name">{profile.name}</h2>
            <p className="employee-role">Rango: <span>{profile.role}</span></p>
        </div>
    )
}

export default EmployeeProfile
