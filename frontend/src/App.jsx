import {useEffect, useState } from 'react'
import { Routes, Route, Navigate} from 'react-router-dom'
import './App.css'
import { Toaster } from 'react-hot-toast';
import Floatingshape from './components/FloatingShape'
// Page import 

import { userAuthStore } from '../store/auth.store.js';
import LoadingSpinner from './components/LoadingSpinner.jsx';

import {
  LoginPage,
  SignUpPage,
  ForgotPasswordPage,EmailVerificationPage,
  DashboardPage,
  ResetPasswordPage
} from './pages/index.js'


//protect routes that required authentication
const ProtectedRoute = ({children}) => {
  const {isAuthenticated, user} = userAuthStore();

  if(!isAuthenticated){
    return <Navigate to='/signup' replace/>
  }
  if(!user.isVerified){
    return <Navigate to='/verify-email' replace/>
  }

  return children;
}
//redirect authenticated users to the home page 

const RedirectAuthenticatedUser = ({children}) => {
  const {isAuthenticated,user} = userAuthStore();

  if(isAuthenticated && user.isVerified){
    return <Navigate to="/"  replace/>
  }else{
    return children;
  }
}

function App() {
  const [count, setCount] = useState(0)
  const {isCheckingAuth,checkAuth,isAuthenticated,user} = userAuthStore()

  useEffect(() => {
    checkAuth()
  },[checkAuth]);
  console.log("isAuthenticated",isAuthenticated);
  console.log("user",user);

  if(isCheckingAuth) return <LoadingSpinner />
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-green-900 flex items-center justify-center relative overflow-hidden '>
      <Floatingshape 
      color= "bg-green-500" size="w-64 h-64" top="-5%" left="10%" delay={0}/>
      <Floatingshape 
      color= "bg-green-500" size="w-64 h-64" top="-5%" left="10%" delay={5}/>
      <Floatingshape 
      color= "bg-green-500" size="w-64 h-64" top="-5%" left="10%" delay={2}/>

      <Routes>
        <Route path = '/' element={
          <ProtectedRoute>
             <DashboardPage  />
          </ProtectedRoute>
        }/>

        <Route path = '/signup' 
        element={
        <RedirectAuthenticatedUser>
          <SignUpPage />
        </RedirectAuthenticatedUser>}
        />

        <Route path = '/login' 
        element={
        <RedirectAuthenticatedUser>
          <LoginPage />
        </RedirectAuthenticatedUser>}
        />
        <Route path = '/verify-email' element={<EmailVerificationPage/>}/>
        <Route path = '/forgot-password' element={<RedirectAuthenticatedUser>
          <ForgotPasswordPage/>
        </RedirectAuthenticatedUser>}/>
        <Route path = '/reset-password/:token' element={
          <RedirectAuthenticatedUser>
          <ResetPasswordPage/>
        </RedirectAuthenticatedUser>
        }/>
      </Routes>
      <Toaster />
    </div>
  )
}

export default App;
