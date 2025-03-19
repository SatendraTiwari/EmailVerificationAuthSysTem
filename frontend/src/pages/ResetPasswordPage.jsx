import React, { useState } from 'react'
import { userAuthStore } from '../../store/auth.store';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Input from '../components/Input'
import { Lock } from 'lucide-react';
import toast from 'react-hot-toast';


const ResetPasswordPage = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const { resetPassword, error, isLoading, message } = userAuthStore();

    const { token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();

        if(newPassword !== confirmPassword){
            alert("Password do not match");
            return;
        }

        try {
            await resetPassword(token,newPassword)
            toast.success("Password is Reset ")

            setTimeout(() => {
                navigate("/login");
            },2000)
        } catch (error) {
            toast.error(error.message || "Error reseting Password");
        }
    }
    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl 
			overflow-hidden'
            >
                <div className='p-8'>
                    <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r text-green-500 bg-clip-txt'>
                        Reset Password
                    </h2>
                    {error && <p className='text-red-500 text-sm mb-4'>{error}</p>}
                    {message && <p className='text-green-500 text-sm mb-4'>{message}</p>}

                    <form onSubmit={handleSubmit}>
                        <Input
                            icon={Lock}
                            type='password'
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />

                        <Input
                            icon={Lock}
                            type='password'
                            placeholder="Confirm new Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <motion.button
                        whileHover={{scale: 1.02}}
                        whileTop={{scale: 0.98}}
                        className='mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
						font-bold rounded-lg shadow-lg hover:from-green-600
						hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
						 focus:ring-offset-gray-900 transition duration-200'
                         disabled={isLoading}
                        >
                            {isLoading ? <Loader className='size-6 animate-spin mx-auto' /> : "Set New Password"}
                        </motion.button>
                    </form>
                </div>
            </motion.div>
        </>
    )
}

export default ResetPasswordPage