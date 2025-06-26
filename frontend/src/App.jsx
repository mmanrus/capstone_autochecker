import React from 'react'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import NotFound from "./pages/NotFound"
import ClassroomActivities from './pages/ClassroomActivities'
import ProtectedRoute from "./components/ProtectedRoute"
import ActivityDetail from './pages/ActivityDetail'
import CreateActivityFormComponent from './components/forms/CreateActivityForm'
import HeaderComponent from './components/semantics/Header'
import Logout from './lib/logout'
import {AuthenticationProvider} from './components/AuthContext'
import {UserContextProvider} from './lib/UserContext'
import TestSuiteForm from './components/forms/TestSuiteForm'

function RegisterAndLogout(){
     localStorage.clear() // Clear the Access Token Before Register
     return <Register />
}
function App() {

     return (
     <>
          <AuthenticationProvider>
               <BrowserRouter>
                    <UserContextProvider>
                         <HeaderComponent />
                              <Routes>
                                   <Route path='/'
                                        element= {
                                             <ProtectedRoute>
                                                  <Home />
                                             </ProtectedRoute>
                                   } />
                                   <Route path = '/classroom/:id'
                                        element={
                                             <ProtectedRoute>
                                                  <ClassroomActivities />
                                             </ProtectedRoute>
                                        }
                                   />     

                                   <Route path = '/classroom/:classroom_id/:id'
                                        element={
                                             <ProtectedRoute>
                                                  <ActivityDetail />
                                             </ProtectedRoute>
                                        }
                                   />        
                                   <Route path = '/classroom/:id/makeactivity'
                                        element={
                                             <ProtectedRoute>
                                                  <CreateActivityFormComponent />
                                             </ProtectedRoute>
                                        }
                                   />
                                   <Route path = '/create-test-suite'
                                        element={
                                             <ProtectedRoute>
                                                  <TestSuiteForm />
                                             </ProtectedRoute>
                                        }
                                   />                 
                                   <Route path='/login' element= { <Login />}
                                   />
                                   <Route path='/logout' element= { <Logout />}
                                   />
                                   <Route path='/register' element= { <RegisterAndLogout />}
                                   />
                                   <Route path='*' element= { <NotFound />} 
                                   />
                              </Routes>
                    </UserContextProvider>
               </BrowserRouter>
          </AuthenticationProvider>
          </>
     )
}

export default App
