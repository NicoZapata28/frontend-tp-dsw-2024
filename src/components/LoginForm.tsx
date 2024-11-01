import { useState } from "react"
import loginService from "../services/login.ts"
import FaceStoreLogo from "../img/face-store.svg"
import "./LoginForm.css"

interface LoginFormProps {
  onLoginSuccess: () => void
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [cuil, setCuil] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault()

    try {
      const response = await loginService.login({ cuil, password })
      localStorage.setItem("token", response.data.token)
      onLoginSuccess()
    } catch (error) {
      setErrorMessage("CUIL o contraseña incorrectos")
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <img src={FaceStoreLogo} alt="logo" className="logo" />
        <h2 className="title">Face-Store</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <input
          type="text"
          placeholder="CUIL"
          value={cuil}
          onChange={({ target }) => setCuil(target.value)}
          className="input"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          className="input"
          required
        />
        <button type="submit" className="button">
          Iniciar sesión
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
