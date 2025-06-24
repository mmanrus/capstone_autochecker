// Wrap the route in ProtectedRoute will need authorization token before accessing the specific route
import {Navigate} from "react-router-dom"
import { IsAuthenticatedContext } from './AuthContext'
import {REFRESH_TOKEN, ACCESS_TOKEN} from '../constants.js'
import {useEffect, useContext} from 'react'



function ProtectedRoute({children}) {
     const {isAuthorized, setIsAuthorized, auth }= useContext(IsAuthenticatedContext)

     useEffect(()=> {
          auth().catch(()=> {})
     }, [])

     if (isAuthorized == null) {
          return <div>Loading....</div>
     }

     // If unauthorized back to login
     return isAuthorized ? children : <Navigate to='/login'/>
}

export default ProtectedRoute