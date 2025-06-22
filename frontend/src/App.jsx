import React from 'react'
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import NotFound from "./pages/NotFound"
import ClassroomActivities from './pages/ClassroomActivities'
import ProtectedRoute from "./components/ProtectedRoute"
import ActivityDetail from './pages/ActivityDetail'
import CreateActivityFormComponent from './components/CreateActivityForm'
function Logout(){
     localStorage.clear() // Clear Existing token
     return <Navigate to='/login' />
}

function RegisterAndLogout(){
     localStorage.clear() // Clear the Access Token Before Register
     return <Register />
}
function App() {

     return (
     <>

          <BrowserRouter>
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
                    <Route path='/login' element= { <Login />}
                    />
                    <Route path='/logout' element= { <Logout />}
                    />
                    <Route path='/register' element= { <RegisterAndLogout />}
                    />
                    <Route path='*' element= { <NotFound />} 
                    />
                    
               </Routes>
          </BrowserRouter>
     </>
  )
}

export default App
