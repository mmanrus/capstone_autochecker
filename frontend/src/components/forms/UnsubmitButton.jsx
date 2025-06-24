import api from '../../api.js'
import {useState} from 'react'

function UnsubmitButtonComponent({submissionId}){
     const [ unsubmitMessage, setUnsubmitMessage] = useState('')
     const [loading, setLoading] = useState(false)
     const unsubmit = async () => {
          try {
               setLoading(true)
               const res = await api.patch(`submission/${submissionId}/unsubmit/`)
               const data = res.data
               setUnsubmitMessage(data)
         
          } catch (err){
               console.log(err)
          } finally {
               setLoading(false)
          }    
     }


     return (
          <>
               <button onclick={unsubmit} disabled={loading}>
                    {loading ? 'Withdrawing' : 'Withdraw'}
               </button>
               { unsubmitMessage && <p>{unsubmitMessage}</p>}
          </>
     )
}

export default UnsubmitButtonComponent