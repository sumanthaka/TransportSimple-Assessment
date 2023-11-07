"use client"
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const [page, setPage] = useState('')
  const [loginData, setLoginData] = useState({
    username: "",
    password: ""
  });
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const loginpage = useRef()
  const registerpage = useRef()

  const client = axios.create({
      baseURL: 'http://localhost:8000',
  })

  useEffect(() => {
    if(localStorage.getItem('access_token')) {
      router.push("/Blog")
    }
  }, [])

  useEffect(() => {
    if(page=="register") {
      registerpage.current.classList.remove('hidden')
      loginpage.current.classList.add('hidden')
    } else if(page=="login") {
      registerpage.current.classList.add('hidden')
      loginpage.current.classList.remove('hidden')
    }
  }, [page])

  const loginUser = async (e) => {
    e.preventDefault();
    const userData = {
      username: loginData.username,
      password: loginData.password
    };
    await axios.post("http://localhost:8000/api/login/", userData).then((response) => {
      localStorage.setItem("access_token", response.data.token)
    });
    router.push("/Blog")
  };

  const registerUser = (e) => {
    e.preventDefault();
    const userData = {
      username: registerData.username,
      email: registerData.email,
      password: registerData.password,
      confirm_password: registerData.confirmPassword
    };
    axios.post("http://localhost:8000/api/register/", userData).then((response) => {
      console.log(response.status, response.data);
    });
  }

  const handleChange = (e) => {
    const value = e.target.value;
    setLoginData({
      ...loginData,
      [e.target.name]: value
    });
  };

  const handleRegisterChange = (e) => {
    const value = e.target.value;
    setRegisterData({
      ...registerData,
      [e.target.id]: value
    });
  }

  return (
      <div className="login-page">
        <div className="form" >
          <form id="register" className="hidden" ref={registerpage} onSubmit={registerUser}>
            <input type="text" placeholder="name" id='username' name='username' value={registerData.username} onChange={handleRegisterChange} />
            <input type="email" placeholder="email address" id='email' name='email' value={registerData.email} onChange={handleRegisterChange} />
            <input type="password" placeholder="password" id='password' name='password' value={registerData.password} onChange={handleRegisterChange} />
            <input type="password" placeholder="confirm password" id='confirmPassword' name='confirm_password' value={registerData.confirmPassword} onChange={handleRegisterChange} />
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
