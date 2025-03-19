import { create } from "zustand";
import axios from "axios";
import toast from 'react-hot-toast';

const API_URL = "http://localhost:8000/api/auth";

axios.defaults.withCredentials = true;

export const userAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    error: null,
    isLoading: false,
    isCheckingAuth:true,


    signup: async(email, password, name) => {
        set({isLoading: true,error:null});
        try {

            if(email.length < 3 && password.length < 3 && name.length < 3){
                set({isLoading: false,error : "fill all the filed"})
                toast.error('Fill All The Filed');
                
            }
            const response = await axios.post(`${API_URL}/signup`,{email,password,name});
            set({user:response.data.user,isAuthenticated:true, isLoading:false})
        } catch (error) {
            set({error:error.response.data.massage || "Error signing up", isLoading:false});
            throw error;
        }
    },

    login: async(email,password) => {
        set({isLoading: true,error:null});
        try {

            const response = await axios.post(`${API_URL}/login`,{email,password});

            set({
                isAuthenticated: true,
                user: response.data.user,
                error:null,
                isLoading:false,
            });
            
        } catch (error) {
            set({isLoading: false,error: error.response?.data?.message || "Error logging in"})
            throw error;
        }
    },

    verifyEmail: async(code)  => {
        set({isLoading:true, error:null});
        try {
            const response = await axios.post(`${API_URL}/verify-email`,{code})
            set({user: response.data.user, isAuthenticated: true, isLoading:false})

            return response.data;

        } catch (error) {
            set({error: error.response.data.user,isAuthenticated: true,isLoading: false});
            throw error;
        }
    },

    checkAuth : async (code) => {
        // await new Promise((resolve) => setTimeout(resolve, 2000));
        set({isCheckingAuth: true, error: null});
        try {
            const response = await axios.get(`${API_URL}/check-auth`)
            set({user: response.data.user,isAuthenticated: true, isCheckingAuth: false});

        } catch (error) {
            set({erro: null, isCheckingAuth: false })
        }
    },

    logout : async() => {
        set({isLoading:true, error:null})
        try {
            const response = await axios.post(`${API_URL}/logout`)
            set({user:null, isAuthenticated: false, isLoading:false})
            } catch (error) {
                set({error: error.response.data.message || "Error logging out", isLoading:false})
            }
    },


    forgotPassword: async (email) => {
        set({isLoading: true,error: null, message: null});
        try{

            const response = await axios.post(`${API_URL}/forgot-password`,{email});
            set({isLoading: false,message: response.data.message}) 

        }catch(error) {
            set({isLoading: false, error: error.response.data.message || "Error sending reset password email"})
            throw error;

        }
    },

    resetPassword : async (token,password) => {
        set({isLoading: true, error: null});
        try {
            const response = await axios.post(`${API_URL}/reset-password/${token}`,{password})
            set({isLoading: false, message: response.data.message});
        } catch (error) {
            set({isLoading: false,message: error.response.data.message || "Error reseting password"});
            throw error;
        }
    }


}))