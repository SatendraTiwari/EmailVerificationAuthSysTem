import { useState } from 'react'
import './App.css'
import Floatingshape from './components/FloatingShape'

import SignUpPage from './pages/SignUpPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import { Routes, Route} from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-green-900 flex items-center justify-center relative overflow-hidden '>
      <Floatingshape 
      color= "bg-green-500" size="w-64 h-64" top="-5%" left="10%" delay={0}/>
      <Floatingshape 
      color= "bg-green-500" size="w-64 h-64" top="-5%" left="10%" delay={5}/>
      <Floatingshape 
      color= "bg-green-500" size="w-64 h-64" top="-5%" left="10%" delay={2}/>

      <Routes>
        <Route path = '/' element="Home"/>
        <Route path = '/signup' element={<SignUpPage/>}/>
        <Route path = '/login' element={<LoginPage/>}/>
      </Routes>
    </div>
  )
}

export default App
