import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import  Login from './pages/login'
import  Ticket from './pages/ticket'
import  Tickets from './pages/tickets'
import  SignUp from './pages/signup'
import  Admin from './pages/admin'
import CheckAuth from './components/check-auth'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <CheckAuth protectedRoute = { true }>
              <Ticket/>
            </CheckAuth>
          } 
          />
          <Route path="/:id" element={
            <CheckAuth protectedRoute = { true }>
              <Tickets/>
            </CheckAuth>
          } 
          />
          <Route path="/login" element={
            <CheckAuth protectedRoute = { false }>
              <Login/>
            </CheckAuth>
          } 
          />
          <Route path="/signup" element={ 
            <CheckAuth protectedRoute = { false }>
              <SignUp/>
            </CheckAuth>
          } 
          />
          <Route path="/admin" element={
            <CheckAuth protectedRoute = { false }>
              <Admin/>
            </CheckAuth>
          } 
          />
        </Routes>
      </BrowserRouter>
    </StrictMode>,
)
