import { useState, useEffect } from 'react'
import api from '../api'
function Home(){
      const [classroom, setClassroom] = useState([])
      useEffect(() => {
            const token = localStorage.getItem('access')
            if (token) {
                  console.log(token)
                  get_classroom()
            }
      }, [])
      const get_classroom = () => {
            api.get('/api/')
                  .then((res) => res.data)
                  .then((data) => { 
                        console.log(data)
                        setClassroom(data)
            }).catch((err) => console.log(err))
      }
      return <div>Home</div>
}

export default Home