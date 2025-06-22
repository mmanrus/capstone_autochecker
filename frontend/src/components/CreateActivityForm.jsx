import { useState } from 'react'
import api from '../api.js'
import { useParams, Link } from 'react-router-dom'

function CreateActivityFormComponent(){
     const {id} = useParams()
     console.log(id)
     const [ message, setMessage] = useState('')
     const [ loading, setLoading] = useState(false)

     // form input
     const [ title, setTitle] = useState('')
     const [ description, setDescription] = useState('')
     const [ file, setFile] = useState(null)
     const [ check50Slug, setCheck50Slug ] = useState('')
     const [ start, setStart ] = useState('')
     const [ deadline, setDeadline ] = useState('')
     const handleFileChange = (event) => {
          setFile(event.target.files[0])
     }
 
     const createActivity = async (event) => {
          event.preventDefault()
          setLoading(true)

          // Form data
          const formData = new FormData()
          formData.append('title', title)
          formData.append('description', description)
          formData.append('check50_slug', check50Slug)
          formData.append('time_open', start)
          formData.append('time_limit', deadline)
          if (file) {
          formData.append('instructions', file)
          }

          try {
               const res = await api.post(`/api/classroom/${id}/makeactivity/`,
                    formData, {
                         headers: {
                              'Content-Type': 'multipart/form-data'
                         }
                    }
               )
               const data = res.data
               setMessage(data)
               
          } catch(err) {
               console.log(err)
          } finally {
               setLoading(false)
          }
     }
     return (
          <>
          <form onSubmit={createActivity} className='form-input'>
               <input className='#' 
                    onChange={(event)=>setTitle(event.target.value)}
                    value={title}
                    placeholder='title'
                    type='text'
                    />

               <textarea className='form-input' 
                    onChange={(event)=>setDescription(event.target.value)}
                    value={description}
                    placeholder='Description'
                    />

               <input className='form-input' 
                    type='file' 
                    onChange={handleFileChange} 
                    />

               <input className='form-input' 
                    onChange={(event)=>setCheck50Slug(event.target.value)}
                    value={check50Slug}
                    placeholder='Check50 Slug'
                    />
               <p>Start date</p>
               <input className='form-input' 
                    value={start}
                    onChange={(event)=>setStart(event.target.value)}
                    type='date'
                    />
               <p>Deadline</p>
               <input className='form-input' 
                    value={deadline}
                    onChange={(event)=>setDeadline(event.target.value)}
                    type='date'
                    />

               <button type='submit' disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</button>
               {message && <p>{message}</p>}
               {loading ? 'Loading': loading}
          </form>
          </>
     )
}

export default CreateActivityFormComponent