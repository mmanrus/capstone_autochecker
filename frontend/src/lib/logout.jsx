import {Navigate} from 'react-router-dom'

export default function Logout(){
     localStorage.clear() // Clear Existing token
     return <Navigate to='/login' />
}

