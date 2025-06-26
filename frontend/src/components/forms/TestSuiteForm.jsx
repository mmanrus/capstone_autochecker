import React, { useState } from 'react'
import TestCase from './addTest'

export default function TestSuiteForm(){
     const [ title, setTitle ] = useState('')
     const [ description, setDescription ] = useState('')
     const [ language, setLanguage ] = useState('')
     const [ testList, setTestList ] = useState([])
     const handleSubmit = ()=> {
     }

     const addTestButton = (e) => {
          e.preventDefault()
          setTestList([...testList, { input: '', output: '' }])
     }
     const handleTestChange = (index, field, value) => {
          const updated = [...testList]
          updated[index][field] = value
          setTestList(updated)
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
                         />
                         ))}
                         <button onClick={addTestButton}>Add test suite </button>
                     </div>
                    
                    <button type='submit'>Submit</button>
               </form>
          </>
     )
}