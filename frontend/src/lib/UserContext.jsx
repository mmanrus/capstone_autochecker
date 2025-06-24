import { createContext, useContext, useEffect, useState} from 'react'
import api from '../api.js'
import { IsAuthenticatedContext } from '../components/AuthContext'

export const UserContext = createContext()

export function UserContextProvider({children}) {
     const {isAuthorized} = useContext(IsAuthenticatedContext)
     const [user, setUser] = useState(null)
     useEffect(()=>{
          if (isAuthorized == true){
               get_user()
          } else {
               setUser(null)
          }
     })

     const get_user = async()  => {
          try {
               const res = await api.get('/api/user/')
               const userData = res.data
               setUser(userData)
          } catch(err){
               console.log(err)
          }
     
     }

     return (<>
          <UserContext.Provider value={{ user, setUser }}>
               {children}
          </UserContext.Provider>
     </>)


}