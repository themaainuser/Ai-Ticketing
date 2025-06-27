import { useEffect, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'


type Props = {
  children: ReactNode,
  protectedRoute: boolean
}

function CheckAuth({children, protectedRoute}: Props) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  useEffect(()=>{
  const token = localStorage.getItem('token');

  if(protectedRoute && !token) {
    navigate('/login');
    setLoading(false);
  } else if (!protectedRoute && token) {
    navigate('/');
    setLoading(false);
  } else {
    setLoading(false);
  }
  },[navigate, protectedRoute])

  if(loading){
    return <div>Loading...</div>
  }
  else{
    return (
    <div> {children}  </div>
    );
  }
} 

export default CheckAuth;