import axios from 'axios'
const baseUrl= 'http://localhost:3006/api/login'

interface LoginCredentials {
  cuil: string,
  password: string
}

const login = async ( credentials: LoginCredentials) =>{
  const response = await axios.post(baseUrl, credentials)
  return response
}

export default {login}