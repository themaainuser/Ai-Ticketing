import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function SignUp() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();
  // useEffect(()=>{

  // },[form])
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    try{
      const res = await axios.post('http://localhost:8080/signup', JSON.stringify(form))
      const data = await res.data.json();
      if (res.data.Ok){
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate("/");
      }
      else{
        console.log(data.error)
      }
    }
    catch(err){
      console.log(err)
    }
  }

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   const response = await fetch('http://localhost:8080/signup', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(form),
  //   });
  //   const data = await response.json();
  //   if (response.status === 200) {
  //     localStorage.setItem('token', data.token);
  //     setLoading(false);
  //   } else {
  //     setLoading(false);
  //   }
  // }
  return (
    <div >
      <form 
      className = "flex flex-col items-center justify-center card-body"
      onSubmit = {handleSubmit} >

        <input className="input input-bordered"
         type="text"
          name="Email"
           value={form.email}
            placeholder='Email'
             onChange={handleChange}
             required />

        <input className="input input-bordered"
         type="password"
          name="Password"
           placeholder='Password'
            value={form.password}
             onChange={handleChange}
             required />
        <button type="submit" value="Sign Up" disabled = { loading } > { loading ? "SigninUp..." : "Sign Up" } </button>
      </form>
    </div>
  )
}

export default SignUp