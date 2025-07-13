
function TestCase({ input, output, helper, index, onChange, onDelete }) {

     return (
          <>
               <div>
                    <label>Input</label>
                    <input 
                         type='text'
                         value={input}
                         onChange={(e) => onChange(index, 'input', e.target.value)}
                         placeholder='23 55'
                    />
                    <label>Expected output: </label>
                    <input
                         type='text'
                         value={output}
                         onChange={(e) => onChange(index, 'output', e.target.value)}
                         placeholder='78'
                    />
                    <label>Helper Guide:</label>
                    <input
                         type='text'
                         value={helper}
                         onChange={(e) => onChange(index, 'helper', e.target.value)}
                         placeholder='78'
                    />
                    <button onClick={()=> onDelete(index)}>Remove</button>
               </div>
          </>
     )
}
export default TestCase