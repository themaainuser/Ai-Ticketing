import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function login() {
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
      const res = await axios.post('http://localhost:8080/login', JSON.stringify(form))
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

  return (
   <div>
    <form onSubmit={handleSubmit}>
      <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} />
      <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} />
      <button type="submit">Login</button>
    </form>
   </div>
  )
}

export default login