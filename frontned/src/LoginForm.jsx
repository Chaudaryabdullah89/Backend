import { Link } from "react-router-dom"
import { redirect } from "react-router-dom"
const LoginForm = () => {

    const handleSubmit = async (e) => {
        e.preventDefault()
        const email = e.target.email.value
        const password = e.target.password.value
        const user = { email, password }

        // Post api request here 
        const response = await fetch("http://localhost:3000/api/login", {
            method: "POST",
            body: JSON.stringify(user),
            headers: {
                "Content-Type": "application/json",

            },

            credentials: "include"
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
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input type="email" name="email" placeholder="Email" />
                <input type="password" name="password" placeholder="Password" />
                <button type="submit">Login</button>
                <Link to="/register">Don't have an account? Register</Link>
            </form>
        </div>
    )
}

export default LoginForm