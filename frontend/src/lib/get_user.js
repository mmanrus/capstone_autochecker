import api from '../api'

const get_user = async()  => {
     try {
          const res = await api.get('/api/user/')
          const userData = res.data
          return userData
     } catch(err){
          console.log(err)
     }

} 

export default get_user