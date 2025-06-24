import Form from '../components/forms/Form'


function Login() {
     return  (
          <>
          <Form route='api/auth/token/' method='login'/>
          </>
     )
}

export default Login