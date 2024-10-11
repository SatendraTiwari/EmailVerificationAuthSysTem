import { motion } from "framer-motion";
import { useState} from "react";
import Input from "../components/Input.jsx";
import {Mail, User,Lock} from "lucide-react"
import { Link } from "react-router-dom";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";


const SignUpPage = () => {

    const {name,setName} = useState('')
    const {email, setEmail} = useState('')
    const {password,setPassword} = useState(' ')

    const handleSignUp = (e) => {

    }

    return(
        <motion.div
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y:0}}
        transition={{duration: 0.5}}
        className="max-w-md w-full h-min bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
        >

            <div className="p-8">
                <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text"> Create Account </h2>

                <form onSubmit={handleSignUp}>
                    <Input 
                      icon={User}
                      text='text'
                      placeholder='full name'
                      value={name}
                      onChange={(e) => setName(e.terget.value)}
                    />

                    <Input 
                    icon={Mail}
                    text='text'
                    placeholder='Email Address'
                    value={email}
                    onChange = {(e) => setEmail(e.terget.value)}
                    />

                    <Input
                    icon={Lock}
                    text='password'
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.terget.value)}
                    />
                       <PasswordStrengthMeter password={password}/>
                    <motion.button 
                      className="mt-5 w-full px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"

                      whileHover={{scale: 1.02}}
                      whileTap={{scale: 0.98}}
                      type="submit"
                    >
                        Sign Up

                    </motion.button>
                </form>
            </div>

            <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
                <p className="text--sm text-gray-400
                ">
                    Already have an account?{" "}
                    <Link to={"/login"} className='text-green-400 hover:underline '>
                    Login 
                    </Link>
                </p>
            </div>

        </motion.div>
    )
}

export default SignUpPage;