import { useState, useContext } from 'react'
import api from '../../api.js'
import { useNavigate } from "react-router-dom"
import {ACCESS_TOKEN, REFRESH_TOKEN} from '../../constants.js'
import { IsAuthenticatedContext } from '../AuthContext'



function Form({route, method}) {
     const [username, setUsername ] = useState('')
     const [password, setPassword ] = useState('')
     const [loading, setLoading] = useState(false)
     const { auth } = useContext(IsAuthenticatedContext)

     const navigate = useNavigate()
     const name = method === 'login' ? "Login" : "Register"
     const handleSubmit = async (e) => {
          // Submission set Loading to True
          setLoading(true)
          e.preventDefault()

          try {
               const res = await api.post(route, {username, password})
               if (method === 'login') {
                    localStorage.setItem(ACCESS_TOKEN, res.data.access)
                    localStorage.setItem(REFRESH_TOKEN, res.data.refresh)
                    await auth() 
                    navigate('/')
               } else {
                    navigate('/login')
               }
          } catch (error) {
               if (error.response) {
                   alert(error.response.data.detail || 'Login failed')
                   console.error('Backend Error:', error.response.data)
               } else {
                   alert('Network error')
                   console.error(error)
               }
          } finally {
               setLoading(false)
          }

     }
     return (
          <>
               <form onSubmit={handleSubmit} className="form-container">
                    <h1>{name}</h1>
                    <input 
                         className='form-input' 
                         type='text' value={username} 
                         onChange={(e) => setUsername(e.target.value)} 
                         placeholder='Username'
                         />
                    <input 
                         className='form-input' 
                         type='password' 
                         value={password}
                         onChange={(e) => setPassword(e.target.value)}
                         placeholder='Password'
                         />
                    <button className='form-button' type="submit">
                         {name}
                    </button>
                    {loading ? <p>Loading...</p>: ''}
               </form>
          </>
     )
}

export default Form