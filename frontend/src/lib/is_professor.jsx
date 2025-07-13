import {useContext, useEffect} from 'react'
import {UserContext } from './UserContext'
import {useNavigate} from 'react-router-dom'
export default function IsProfessor({children}){
     const navigate = useNavigate()
     const { user } = useContext(UserContext)
     useEffect(()=>{
          if (user && user.role!== 'professor')
               navigate('/')
     })

     if (!user ) {
          return <><progress value={null}/></>
     }
     return <>{children}</>
}