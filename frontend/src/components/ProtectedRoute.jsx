// Wrap the route in ProtectedRoute will need authorization token before accessing the specific route
import {Navigate} from "react-router-dom"
import {jwtDecode} from 'jwt-decode'
import api from '../api'
import {REFRESH_TOKEN, ACCESS_TOKEN} from '../constants.js'
import {useState, useEffect} from 'react'

function ProtectedRoute(children) {
     const [isAuthorized, setIsAuthorized] = useState(null)

     useEffect(()=> {
          auth().catch(()=> setIsAuthorized(false))
     }, [])

     const refreshToken = async ()=>{
          // Get RefreshToken
          const refreshToken = localStorage.getItem(REFRESH_TOKEN)
          try {
               // Try to respond to this route with the refresh token to get a new access token
               const res = await api.post('api/token/refresh/', {refresh: refreshToken})
               if (res.status == 200){
                    localStorage.setItem(ACCESS_TOKEN, res.data.access)
                    setIsAuthorized(true)
               } else {
                    setIsAuthorized(false)
               }
          } catch (error) {
               console.log(error)
               setIsAuthorized(false)
          }
     }
     const auth = async ()=>{
          const token = localStorage.getItem(ACCESS_TOKEN)
          if (!token){
               setIsAuthorized(false)
               return
          }
          const decode = jwtDecode(token)
          const tokenExperation = decode.exp
          const now = Date.now() / 1000
          // check token if not expired
          if (tokenExperation < now) {
               await refreshToken()
          } else {
               setIsAuthorized(true)
          }
     }

     if (isAuthorized) == null {
          return <div>Loading....</div>
     }
     return isAuthorized ? children : <Navigate to='/login'/>
}

export default ProtectedRoute