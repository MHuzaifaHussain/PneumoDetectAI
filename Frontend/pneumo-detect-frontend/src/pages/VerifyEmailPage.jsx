import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { apiCall } from '../services/api';
import { TbLungs } from 'react-icons/tb';
import { CheckCircle, XCircle, Loader } from 'lucide-react';

const VerifyEmailPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying');
    const [message, setMessage] = useState('Verifying your email...');

    useEffect(() => {
        const email = searchParams.get('email');
        const token = searchParams.get('token');

        if (!email || !token) {
            setStatus('error');
            setMessage('Invalid verification link. Please try again.');
            return;
        }

        const verify = async () => {
            try {
                const response = await apiCall('get', `/auth/verify-email?email=${email}&token=${token}`);
                setStatus('success');
                setMessage(response.msg || 'Email verified successfully! Redirecting to login...');
                toast.success('Verification successful!');
                setTimeout(() => navigate('/login'), 7000);
            } catch (error) {
                setStatus('error');
                const errorMessage = error.response?.data?.detail || 'Verification failed. The link may be expired or invalid.';
                setMessage(errorMessage);
            }
        };

        verify();
    }, [searchParams, navigate]);

    const statusIcons = {
        verifying: <Loader size={48} className="animate-spin text-indigo-400" />,
        success: <CheckCircle size={48} className="text-green-400" />,
        error: <XCircle size={48} className="text-red-400" />,
    };

    return (
        <div className="min-h-screen bg-[#0a091e] flex flex-col items-center justify-center p-4 text-center font-sans">
            <Link to="/" className="flex items-center gap-2 mb-8">
                <TbLungs className="w-10 h-10 text-indigo-400" />
                <span className="text-3xl font-bold text-white">PneumoDetect AI</span>
            </Link>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#16152d]/50 backdrop-blur-lg border border-slate-800 p-10 rounded-2xl shadow-lg w-full max-w-lg"
            >
                <div className="mb-6">
                    {statusIcons[status]}
                </div>
                <h1 className="text-2xl font-bold text-white mb-4">
                    {status === 'verifying' && 'Verification in Progress'}
                    {status === 'success' && 'Verification Successful!'}
                    {status === 'error' && 'Verification Failed'}
                </h1>
                <p className="text-gray-400">{message}</p>
                {status !== 'verifying' && (
                    <Link to="/login">
                        <button className="mt-8 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 rounded-lg hover:brightness-110 transition-all">
                            Go to Login
                        </button>
                    </Link>
                )}
            </motion.div>
        </div>
    );
};

export default VerifyEmailPage;
