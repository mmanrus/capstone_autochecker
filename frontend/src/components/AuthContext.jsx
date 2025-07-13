import { createContext, useState, useEffect } from 'react'
import {jwtDecode} from 'jwt-decode'
import api from '../api.js'
import {REFRESH_TOKEN, ACCESS_TOKEN} from '../constants.js'


export const IsAuthenticatedContext = createContext()


export function AuthenticationProvider({children}) {
     const [isAuthorized, setIsAuthorized] = useState(null)

     const refreshToken = async ()=>{
          // Get RefreshToken
          const refreshToken = localStorage.getItem(REFRESH_TOKEN)
          try {
               // Try to respond to this route with the refresh token to get a new access token
               const res = await api.post('api/auth/token/refresh/', {refresh: refreshToken})
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
               // if expired refresh token
               await refreshToken()
          } else {
               setIsAuthorized(true)
          }
     }
     useEffect(()=> {
          auth().catch(()=> setIsAuthorized(false))
     }, [])
     return (
          <IsAuthenticatedContext.Provider value={{ isAuthorized, setIsAuthorized, auth }}>
               {children}
          </IsAuthenticatedContext.Provider>
     )

}