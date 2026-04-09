import { useEffect, useState } from 'react'
import './App.css'
import { Link } from 'react-router-dom'

function App() {

  const [user, setUser] = useState(null)

  const fetchUser = async () => {

    const response = await fetch("http://localhost:3000/api/user", {
      credentials: "include",
      headers: {
        "Authorization": `Bearer ${document.cookie.split(";").find(c => c.trim().startsWith("token="))?.split("=")[1]}`
      }
    })
    const data = await response.json()
    console.log(data)
    setUser(data.user)
  }
  useEffect(() => {
    fetchUser()
  }, [])
  return (
    <div>
      <h1>Welcome {user?.username || "No user found"} to the dashboard</h1>
      <h2>Your email is  {user?.email || "No email found"}</h2>
      <Link to="/login">Login</Link>
      {' | '}
      <Link to="/register">Register</Link>
    </div>
  )
}

export default App
