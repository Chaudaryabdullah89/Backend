import react from "react"
import { useState } from "react"
import { Link, redirect } from "react-router-dom"


const RegisterForm = () => {

  const [username, setusername] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    const username = e.target.username.value
    const email = e.target.email.value
    const password = e.target.password.value

    const user = { username, email, password }


    // Post api request here 
    const response = await fetch("http://localhost:3000/api/register", {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json"
      }
    })
    const data = await response.json()
    console.log("response", response)
    console.log("data", data)

    if (response.ok) {
      window.location.href = "/"
    }


    console.log(user)
  }

  return (
    <div>
      <h1>Register</h1>

      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Username" />
        <input type="email" name="email" placeholder="Email" />
        <input type="password" name="password" placeholder="Password" />
        <button type="submit">Register</button>
        <Link to="/login">Already have an account? Login</Link>
      </form>
    </div>
  )
}

export default RegisterForm
