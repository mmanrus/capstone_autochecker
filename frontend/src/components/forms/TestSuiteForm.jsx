import React, { useState } from 'react'
import TestCase from './addTest'
import api from '../../api.js'
export default function TestSuiteForm(){
     const [ title, setTitle ] = useState('')
     const [ description, setDescription ] = useState('')
     const [ language, setLanguage ] = useState('')
     const [ testList, setTestList ] = useState([])
     const [message, setMessage] = useState('')
     const handleSubmit = async (e)=> {
          e.preventDefault()
          const form = new FormData()
          form.append('title', title)
          form.append('description', description)
          form.append('language', language)
          form.append('test_cases', JSON.stringify(testList))
          console.log(form)
          console.log("FormData contents:")
          try {
               const res = api.post('/api/create-test-suite/',
                    form
               )
               const data = res.data
               setMessage(data)
          } catch(err){
               console.log(message)
               console.log(err)
          }
          console.log('languge',form.get('language'))
          for (let [key, value] of form.entries()){
               if (key === 'testList'){
                    console.log(`${key}`, JSON.parse(value))
               } else
               {console.log(`${key}:`, value)}

          }
          
     }

     const addTestButton = (e) => {
          e.preventDefault()
          setTestList([...testList, { input: '', output: '' ,  helper: ''}])
     }
     const handleTestChange = (index, field, value) => {
          const updated = [...testList]
          updated[index][field] = value
          setTestList(updated)
     }

     const removeTestFields = (i) => {
          let newTestList = [...testList]
          newTestList.splice(i, 1)
          setTestList(newTestList)
     }
     return (
          <>
               <form onSubmit={handleSubmit} className='form-container'>
                    <input 
                         value={title}
                         type='text'
                         placeholder='title'
                         onChange={(e)=> setTitle(e.target.value)}
                    />
                    <input 
                         value={description}
                         type='text'
                         placeholder='Short description'
                         max={255}
                         onChange={(e)=> setDescription(e.target.value)}
                    />
                    <label>Pick a programming Language:
                         <select name='language' value={language} onChange={(e)=> setLanguage(e.target.value)}>
                              <option value='' disabled>Select language</option> 
                              <option value='c'>C</option>
                              <option value='py'>Python</option>
                         </select>
                    </label>
                     <div>
                     {testList.map((test, index) => (
                         <TestCase
                              key={index}
                              index={index}
                              input={test.input}
                              output={test.output}
                              helper={test.helper}
                              onChange={handleTestChange}
                              onDelete={removeTestFields}
                         />
                         ))}
                         <button onClick={addTestButton}>Add test suite </button>
                     </div>
                    
                    <button type='submit'>Submit</button>
               </form>
          </>
     )
}