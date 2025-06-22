import {useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../api.js'
import formattedDate from './utils.js'
import SubmitFormComponent from '../components/SubmitForm'

function ActivityDetail() {
     const [ details, setDetails ] = useState('')
     const { classroom_id, id } = useParams()
     const get_activity_detail = async () => {
          try {
               const res = await api.get(`/api/classroom/${classroom_id}/${id}`)
               const data = res.data
               setDetails(data)
               console.log("Details :",data)
          } catch (err){
               console.log("Failed to fetch", err)
          }
     }
     useEffect(()=>{
          get_activity_detail()
     }, [classroom_id, id])

     return (
     <>
     <h1>Activity</h1>
     { details.activity ? (
          <>
               <h1>{details.activity.title}</h1>
               <article>{details.activity.description}</article>
               <p>{details.activity.instructions}</p>
               <p>{formattedDate(details.activity.time_limit)}</p>
               <SubmitFormComponent classroomId={classroom_id} activityId={id}/>
          </>
          // add form for submission
     ): ''}
     </>
     )
}

export default ActivityDetail