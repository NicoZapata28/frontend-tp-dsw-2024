import { useState } from "react"
import loginService from '../services/login.ts'
import { Form, Button, Container, Alert } from 'react-bootstrap'

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
    <Container
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ backgroundImage: 'url("/path/to/your/image.jpg")', backgroundSize: 'cover' }}
    >
      <Form className="p-4 shadow rounded" style={{ maxWidth: '400px' }} onSubmit={handleLogin}>
        <h2 className="text-center">Login</h2>
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        <Form.Group controlId="cuil">
          <Form.Label>CUIL:</Form.Label>
          <Form.Control
            type="text"
            value={cuil}
            onChange={({ target }) => setCuil(target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Password:</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="w-100">
          Login
        </Button>
      </Form>
    </Container>
  )
}

export default LoginForm