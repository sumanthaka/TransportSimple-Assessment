"use client"
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import axios from 'axios'

export default function Home() {
  const [page, setPage] = useState('')
  const [loginData, setLoginData] = useState({
    username: "",
    password: ""
  });
  const loginpage = useRef()
  const registerpage = useRef()

  const client = axios.create({
      baseURL: 'http://localhost:8000',
  })

  useEffect(() => {
    if(page=="register") {
      registerpage.current.classList.remove('hidden')
      loginpage.current.classList.add('hidden')
    } else if(page=="login") {
      registerpage.current.classList.add('hidden')
      loginpage.current.classList.remove('hidden')
    }
  }, [page])

  async function createUser() {
    let data = {
      username: document.getElementById('username').value,
      email: document.getElementById('email').value,
      password: document.getElementById('password').value,
      confirm_password: document.getElementById('confirmPassword').value,
    }
    console.log(data)
    await client.post('api/register/', JSON.stringify(data), {'headers': {'Content-Type': 'application/json'}})
  }

  async function apiRequest(data) 
  {
    await client.post('api/login/', JSON.stringify(data), {'headers': {'Content-Type': 'application/json'}})
  }


  const loginUser = (e) => {
    e.preventDefault();
    const userData = {
      username: loginData.username,
      password: loginData.password
    };
    axios.post("http://localhost:8000/api/login/", userData).then((response) => {
      console.log(response.status, response.data);
    });
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setLoginData({
      ...loginData,
      [e.target.name]: value
    });
  };

  return (
      <div className="login-page">
        <div className="form" >
          <form id="register" className="hidden" ref={registerpage} onSubmit={createUser}>
            <input type="text" placeholder="name" id='username' />
            <input type="email" placeholder="email address" id='email' />
            <input type="password" placeholder="password" id='password' />
            <input type="password" placeholder="confirm password" id='confirmPassword' />
            <button type='submit'>create</button>
            <p className="message">Already registered? <a onClick={()=>{setPage('login')}}>Sign In</a></p>
          </form>
          <form id="login" className="login-form" ref={loginpage} onSubmit={loginUser}>
            <input type="text" placeholder="username" id='loginUsername' name='username' value={loginData.username} onChange={handleChange} />
            <input type="password" placeholder="password" id='loginPassword' name='password' value={loginData.password} onChange={handleChange}/>
            <button>login</button>
            <p className="message">Not registered? <a onClick={()=>{setPage('register')}}>Create an account</a></p>
          </form>
        </div>
      </div>
  )
}
