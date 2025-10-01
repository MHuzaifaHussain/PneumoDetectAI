import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { TbLungs } from 'react-icons/tb';
import { User, Mail, Lock, Loader } from 'lucide-react';
import { apiCall } from '../services/api';

const RegisterPage = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        if (data.password !== data.confirm_password) {
            return toast.error("Passwords do not match.");
        }

        const payload = {
            username: data.username.trim(),
            email: data.email.trim(),
            password: data.password,
            confirm_password: data.confirm_password,
        };
        
        try {
            const response = await apiCall('post', '/auth/register', payload);
            toast.success(response.msg || "Registration successful! Please check your email to verify.", { 
                duration: 5000 
            });
            navigate('/login', { state: { message: "Please check your email to verify your account." } });
        } catch (error) {
            console.error("Registration failed:", error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a091e] p-4 font-sans">
            <div className="relative w-full max-w-4xl flex flex-col md:flex-row bg-[#16152d]/50 backdrop-blur-lg border border-slate-800 shadow-2xl rounded-2xl overflow-hidden">
                <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900/50 via-purple-900/50 to-pink-900/50 text-white p-8 md:p-12 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                    >
                        <TbLungs size={80} className="mx-auto text-indigo-400" />
                        <h1 className="text-4xl font-bold mt-4">PneumoDetect AI</h1>
                        <p className="mt-2 text-indigo-200">Empowering Diagnostics with AI</p>
                    </motion.div>
                </div>
                
                <div className="w-full md:w-1/2 p-8 sm:p-12">
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                        <p className="text-gray-400 mb-8">Get started with your free account today.</p>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            {/* Username Input */}
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Username"
                                    {...register('username', { 
                                        required: "Username is required", 
                                        minLength: { value: 3, message: "Username must be at least 3 characters" } 
                                    })}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
                                />
                                {errors.username && <p className="text-red-500 text-xs mt-1 pl-1">{errors.username.message}</p>}
                            </div>
                            
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
                                    {...register('password', { 
                                        required: "Password is required",
                                        minLength: { value: 6, message: "Password must be at least 6 characters" }
                                    })}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
                                />
                                {errors.password && <p className="text-red-500 text-xs mt-1 pl-1">{errors.password.message}</p>}
                            </div>

                            {/* Confirm Password Input */}
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="password"
                                    placeholder="Confirm Password"
                                    {...register('confirm_password', { required: "Please confirm your password" })}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
                                />
                                {errors.confirm_password && <p className="text-red-500 text-xs mt-1 pl-1">{errors.confirm_password.message}</p>}
                            </div>

                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="w-full py-3 text-white font-semibold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-lg hover:brightness-110 transform hover:-translate-y-px transition-all duration-300 disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {isSubmitting ? <Loader className="animate-spin mr-2" size={20}/> : null}
                                {isSubmitting ? 'Creating Account...' : 'Register'}
                            </button>
                        </form>
                        
                        <div className="text-center mt-8">
                            <p className="text-sm text-gray-400">Already have an account?</p>
                            <Link to="/login" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                                Login Here
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
