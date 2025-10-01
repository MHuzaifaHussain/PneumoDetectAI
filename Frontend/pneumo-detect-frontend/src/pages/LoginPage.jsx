import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { TbLungs } from 'react-icons/tb';
import { Mail, Lock, Loader } from 'lucide-react';
import { apiCall } from '../services/api';

const LoginPage = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    const navigate = useNavigate();
    const location = useLocation();

    // Check if there's a message from the registration page
    useEffect(() => {
        if (location.state?.message) {
            toast.success(location.state.message, { duration: 5000 });
        }
    }, [location.state]);

    const onSubmit = async (data) => {
        const payload = {
            email: data.email.trim(),
            password: data.password,
        };
        
        try {
            const response = await apiCall('post', '/auth/login', payload);
            toast.success(response.msg || "Login successful!");
            navigate('/dashboard'); // Redirect to the dashboard on successful login
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a091e] p-4 font-sans">
            <div className="relative w-full max-w-4xl flex flex-col md:flex-row bg-[#16152d]/50 backdrop-blur-lg border border-slate-800 shadow-2xl rounded-2xl overflow-hidden">
                {/* Left Side - Branding */}
                <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900/50 via-purple-900/50 to-pink-900/50 text-white p-8 md:p-12 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                    >
                        <TbLungs size={80} className="mx-auto text-indigo-400" />
                        <h1 className="text-4xl font-bold mt-4">Welcome Back</h1>
                        <p className="mt-2 text-indigo-200">Log in to access your dashboard.</p>
                    </motion.div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full md:w-1/2 p-8 sm:p-12">
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        <h2 className="text-3xl font-bold text-white mb-2">Login</h2>
                        <p className="text-gray-400 mb-8">Please enter your details to continue.</p>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            {/* Email Input */}
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    {...register('email', { 
                                        required: "Email is required", 
                                        pattern: { 
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid email address" 
                                        } 
                                    })}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1 pl-1">{errors.email.message}</p>}
                            </div>

                            {/* Password Input */}
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    {...register('password', { required: "Password is required" })}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
                                />
                                {errors.password && <p className="text-red-500 text-xs mt-1 pl-1">{errors.password.message}</p>}
                            </div>

                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="w-full py-3 text-white font-semibold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-lg hover:brightness-110 transform hover:-translate-y-px transition-all duration-300 disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {isSubmitting ? <Loader className="animate-spin mr-2" size={20}/> : null}
                                {isSubmitting ? 'Logging In...' : 'Login'}
                            </button>
                        </form>
                        
                        <div className="text-center mt-8">
                            <p className="text-sm text-gray-400">Don't have an account?</p>
                            <Link to="/register" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                                Register Here
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
