import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'
function Home(){
      const [classroom, setClassroom] = useState([])
      useEffect(() => {
            const token = localStorage.getItem('access')
            if (token) {
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
      return <>
      <div>Home</div>
      <ul>
            {classroom.length > 0 ? (
                  classroom.map((item) => (
                        <li key={item.id}>
                              <Link to={`/classroom/${item.id}`}>
                                    <h4>{item.class_name}</h4><h4>{item.class_code}</h4><p>{item.schedule}</p><strong>{item.teacher_assigned.full_name}</strong>
                              </Link>
                        </li>
                  ))
            ) : (
                  <p>Loading....</p>
            )}
      </ul>
      </>
}

export default Home