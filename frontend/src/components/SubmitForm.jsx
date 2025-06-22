import { useState } from 'react'
import api from '../api.js'
import UnsubmitButtonComponent from './UnsubmitButton'

function SubmitFormComponent({classroomId, activityId}){
     const [ file, setFile ] = useState(null)
     const [ message, setMessage ] = useState('')
     const [ submission, setSubmission ] = useState('')
     const [ loading, setLoading ] = useState(false)

     const handleFileChange = (event) => {
          setFile(event.target.files[0])
     }
     const submitActivity = async (e) => {

          setLoading(true)
          e.preventDefault()
          const formData = new FormData()
          try {
               const res = await api.post(
                    `/classroom/${classroomId}/activity/${activityId}/submit/`,
                    formData, {
                         'Content-Type': 'multipart/form-data'
                    }
               )
               const data = res.data
               setMessage(data)
               
          } catch (err) {
               console.log(err)
          } finally {
               setLoading(false)
          }
     }
     return (
          <>
               <form onSubmit={submitActivity} className='#'>
                    <input type='file' onChange={handleFileChange} />
                    { file && <p>Selected file: {file.name}</p> }
                    <button type='submit'>Submit</button>
                    { loading ? <p>Loading...</p>: ''}
                    { message.id ? <UnsubmitButtonComponent submissionId='' /> : ''}
                    
               </form>
               {message ? <p>{message}</p> : ''} 
               
          </>
     )
}

export default SubmitFormComponent