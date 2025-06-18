import Form from '../components/Form'


function Register(){
     return (
          <>
          <Form route='/api/auth/signup' method='register'/>
          </>
     )
}

export default Register