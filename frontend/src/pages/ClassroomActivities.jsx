import { useEffect, useState } from 'react'
import {useParams, Link} from 'react-router-dom'
import api from '../api.js'
import formattedDate from './utils.js'
function ClassroomActivities(){
     const {id} = useParams()
     const [activities, setActivities] = useState({
          classroom: {},
          activity: []
     })

     useEffect(()=>{
          get_activiites()
     }, [id])
     const get_activiites = () =>{
          api.get(`/api/classroom/${id}/`)
               .then((res) => {
                    setActivities(res.data)
                    console.log(res.data)
               }
          )
               .catch((err)=> console.log(err))
     }
     return (
          <>
            <h1>Classroom Activities</h1>
            <Link to={`/classroom/${id}/makeactivity`}>Create Activity</Link>
        
            {activities.activity.length > 0 ? (
              <ul>
                {activities.activity.map((activity) => (
                  <li key={activity.id}>
                    <Link to={`/classroom/${activities.classroom.id}/${activity.id}`}>
                      <strong>{activity.title}</strong>
                    </Link>{" "}
                    {formattedDate(activity.time_limit)}{" "}
                    {activity.isClosed ? "Closed" : "Open"}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No activities available.</p>
            )}
          </>
        )
}

export default ClassroomActivities