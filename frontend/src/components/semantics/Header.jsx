import { useContext, } from 'react'
import { UserContext} from '../../lib/UserContext'

import { LuBell } from "react-icons/lu";
import { useNavigate } from 'react-router-dom'
import {IsAuthenticatedContext} from '../AuthContext'


function HeaderComponent(){
     const { user, setUser } = useContext(UserContext)

     const { auth } = useContext(IsAuthenticatedContext)
     const navigate = useNavigate() 
     const logout = async (e) => {
          e.preventDefault();
          localStorage.clear();
          setUser(null);     // Clear user state
          await auth()
          navigate('/login');       // Redirect
     }
     
     return (
          <>
          <header className="header bg-red-500 text-white flex justify-between items-center px-4 py-2">
               <h1 className="logo text-red font-medium"><a href="#">Flexbox</a></h1>
               <ul className="main-nav">

                    <li><a href="#" className='text-red font-medium'>Home</a></li>
                    <li><a href="#">About</a></li>
                    { user && (
                         <>
                              <li><a href="#">{user.username}</a></li>
                              <li><a href="#"><LuBell /></a></li>
                              <li>
                                   <a href="#" onClick={logout}>
                                        Logout
                                   </a>
                              </li>
                         </>)}
                    <li><a href="#">Contact</a></li>
               </ul>
          </header> 
          </>
     )
}

export default HeaderComponent