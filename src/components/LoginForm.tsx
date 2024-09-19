import { useState } from "react"
import loginService from '../services/login.ts'

interface LoginFormProps {
  onLoginSuccess: () => void
}

const LoginForm: React.FC<LoginFormProps> = ({onLoginSuccess}) => {
  const [cuil, setCuil] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    
    try {
      const response = await loginService.login({ cuil, password })
      localStorage.setItem('token', response.data.token)
      onLoginSuccess()
    } catch (error) {
      setErrorMessage('Invalid CUIL or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  return (
    <div>
      <h2>Login</h2>
      {errorMessage && <div className="error">{errorMessage}</div>}
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="cuil">CUIL:</label>
          <input
            type="text"
            id="cuil"
            value={cuil}
            onChange={({ target }) => setCuil(target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default LoginForm