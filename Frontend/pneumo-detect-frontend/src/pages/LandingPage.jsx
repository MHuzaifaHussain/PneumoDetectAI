import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Zap, ShieldCheck, UserPlus, LogIn, User } from 'lucide-react';
import { TbLungs } from 'react-icons/tb';

const MotionSection = ({ children, id }) => {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.1 }
        );

        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, []);

    return (
        <motion.section
            id={id}
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="py-20"
        >
            {children}
        </motion.section>
    );
};


// --- The Main Landing Page Component ---
const LandingPage = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    const handleNavigation = (path) => {
        setIsModalOpen(false);
        navigate(path);
    };


    return (
        <>
            {/* Header */}
            <header className={`fixed top-0 left-0 right-0 z-50 p-4 transition-all duration-300 ${isScrolled ? 'bg-opacity-80 backdrop-blur-lg border-b border-white/10 shadow-lg' : 'bg-transparent'}`} style={{ backgroundColor: isScrolled ? 'rgba(10, 9, 30, 0.8)' : '' }}>
                <div className="container mx-auto flex justify-between items-center">
                    <a href="#" className="text-2xl font-bold text-white flex gap-2">
                        <TbLungs className="w-8 h-8 text-indigo-400" />
                        <p>PneumoDetect AI</p>
                        </a>
                    <nav className="hidden md:flex space-x-8">
                        <a href="#" className="text-gray-300 hover:text-white transition">Home</a>
                        <a href="#features" className="text-gray-300 hover:text-white transition">Features</a>
                        <a href="#tech" className="text-gray-300 hover:text-white transition">Technology</a>
                        <a href="#contact" className="text-gray-300 hover:text-white transition">Contact</a>
                    </nav>
                    <motion.button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-indigo-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-indigo-500 transition"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Get Started
                    </motion.button>
                </div>
            </header>

            {/* Hero Section */}
            <main className="relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900/30 via-purple-900/30 to-pink-900/30 opacity-40"></div>
                <div className="container mx-auto px-6 pt-48 pb-32 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7 }}
                    >
                        <div className="inline-block bg-indigo-500/20 text-indigo-300 text-sm font-semibold px-4 py-1 rounded-full mb-4">
                            Powered by EfficientNetB0
                        </div>
                        <h2 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
                           AI-Powered Pneumonia Classification
                        </h2>
                        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-10">
                           Leveraging state-of-the-art artificial intelligence to analyze chest X-rays for pneumonia classification in seconds. Our platform provides a reliable second opinion for medical professionals.
                        </p>
                        <div className="flex justify-center items-center gap-4">
                            <motion.button
                                onClick={() => navigate('/guest-predict')}
                                className="bg-indigo-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-indigo-500 transition text-lg shadow-lg shadow-indigo-600/30"
                                whileHover={{ scale: 1.05, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Try Now
                            </motion.button>
                            <motion.a
                                href="#tech"
                                className="border-2 border-gray-500 text-white font-bold px-8 py-4 rounded-xl hover:bg-gray-700/50 transition text-lg"
                                whileHover={{ scale: 1.05, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Learn More
                            </motion.a>
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* Features Section */}
            <MotionSection id="features">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h3 className="text-4xl font-bold text-white mb-4">Why Choose PneumoDetect AI?</h3>
                        <p className="text-gray-400 max-w-2xl mx-auto">Our platform is built to provide fast, reliable, and accessible diagnostic support.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <motion.div whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 text-center transition-transform duration-300">
                            <div className="mb-6 inline-block p-4 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full"><CheckCircle className="h-8 w-8 text-white" /></div>
                            <h4 className="text-2xl font-bold text-white mb-3">High Accuracy</h4>
                            <p className="text-gray-300">Trained on millions of images, our model achieves state-of-the-art accuracy in pneumonia detection.</p>
                        </motion.div>
                        <motion.div whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 text-center transition-transform duration-300">
                             <div className="mb-6 inline-block p-4 bg-gradient-to-br from-purple-600 to-pink-700 rounded-full"><Zap className="h-8 w-8 text-white" /></div>
                            <h4 className="text-2xl font-bold text-white mb-3">Rapid Results</h4>
                            <p className="text-gray-300">Go from upload to diagnosis in under 30 seconds. Drastically reduce waiting times and improve patient care.</p>
                        </motion.div>
                        <motion.div whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 text-center transition-transform duration-300">
                             <div className="mb-6 inline-block p-4 bg-gradient-to-br from-pink-600 to-rose-700 rounded-full"><ShieldCheck className="h-8 w-8 text-white" /></div>
                            <h4 className="text-2xl font-bold text-white mb-3">Secure & Private</h4>
                            <p className="text-gray-300">We prioritize data privacy with robust, end-to-end encryption to ensure patient confidentiality.</p>
                        </motion.div>
                    </div>
                </div>
            </MotionSection>

            {/* Our Mission Section */}
            <MotionSection id="mission">
                 <div className="container mx-auto px-6">
                     <div className="flex flex-col md:flex-row items-center gap-12">
                         <div className="md:w-1/2">
                             <img src="https://placehold.co/600x450/0a091e/e0e0e0?text=Medical+Professional+Collaboration" alt="Doctors collaborating" className="rounded-2xl w-full h-auto shadow-lg border-2 border-white/10" />
                         </div>
                         <div className="md:w-1/2">
                             <span className="text-indigo-400 font-semibold">Our Mission</span>
                             <h3 className="text-4xl font-bold text-white mt-2 mb-6">Empowering Healthcare with AI</h3>
                             <p className="text-gray-300 mb-8">
                                 Our goal is to augment the capabilities of medical professionals by providing an incredibly fast and accurate tool for pneumonia diagnosis. We believe that by leveraging cutting-edge technology, we can help improve patient outcomes, streamline workflows, and make healthcare more accessible for everyone.
                             </p>
                         </div>
                     </div>
                 </div>
            </MotionSection>

            {/* Technology Section */}
            <MotionSection id="tech">
                <div className="container mx-auto px-6">
                     <div className="flex flex-col md:flex-row-reverse items-center gap-12">
                         <div className="md:w-1/2">
                             <span className="text-indigo-400 font-semibold">Our Technology</span>
                             <h3 className="text-4xl font-bold text-white mt-2 mb-6">EfficientNetB0 Architecture</h3>
                             <p className="text-gray-300 mb-8">
                                 PneumoDetect AI is built upon EfficientNetB0, a state-of-the-art convolutional neural network (CNN). This model is renowned for its exceptional balance of accuracy and computational efficiency, achieved through a novel scaling method. Our model has been fine-tuned and validated on a diverse dataset of over one million chest radiographs.
                             </p>
                             <div className="flex flex-wrap gap-4">
                                 <span className="bg-gray-700 text-gray-200 px-4 py-2 rounded-lg text-sm font-medium">TensorFlow</span>
                                 <span className="bg-gray-700 text-gray-200 px-4 py-2 rounded-lg text-sm font-medium">Convolutional Neural Networks</span>
                                 <span className="bg-gray-700 text-gray-200 px-4 py-2 rounded-lg text-sm font-medium">Transfer Learning</span>
                                 <span className="bg-gray-700 text-gray-200 px-4 py-2 rounded-lg text-sm font-medium">Data Augmentation</span>
                             </div>
                         </div>
                         <div className="md:w-1/2 p-4">
                            <svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                                <defs>
                                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style={{stopColor:'#1e3a8a',stopOpacity:1}} /><stop offset="100%" style={{stopColor:'#4c1d95',stopOpacity:1}} /></linearGradient>
                                    <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style={{stopColor:'#4c1d95',stopOpacity:1}} /><stop offset="100%" style={{stopColor:'#be185d',stopOpacity:1}} /></linearGradient>
                                </defs>
                                <rect x="10" y="75" width="30" height="50" rx="5" fill="url(#grad1)" className="pulsing-node" style={{animationDelay: '0.5s'}}/>
                                <text x="15" y="105" fontFamily="Inter" fontSize="6" fill="white">Input</text>
                                <rect x="55" y="50" width="40" height="100" rx="8" fill="url(#grad1)" opacity="0.7"/>
                                <rect x="105" y="50" width="40" height="100" rx="8" fill="url(#grad1)" opacity="0.8"/>
                                <rect x="155" y="50" width="40" height="100" rx="8" fill="url(#grad2)" opacity="0.9"/>
                                <text x="95" y="40" fontFamily="Inter" fontSize="8" fill="#a5b4fc">EfficientNetB0 Blocks</text>
                                <line x1="40" y1="100" x2="55" y2="100" stroke="#a5b4fc" strokeWidth="1" strokeDasharray="2,2"/>
                                <line x1="95" y1="100" x2="105" y2="100" stroke="#a5b4fc" strokeWidth="1" strokeDasharray="2,2"/>
                                <line x1="145" y1="100" x2="155" y2="100" stroke="#a5b4fc" strokeWidth="1" strokeDasharray="2,2"/>
                                <circle cx="210" cy="100" r="15" fill="url(#grad2)" className="pulsing-node" />
                                <circle cx="245" cy="100" r="10" fill="url(#grad2)" className="pulsing-node" style={{animationDelay: '0.2s'}}/>
                                <path d="M 195 60 L 210 90" stroke="#a5b4fc" strokeWidth="0.5" opacity="0.5"/>
                                <path d="M 195 80 L 210 95" stroke="#a5b4fc" strokeWidth="0.5" opacity="0.5"/>
                                <path d="M 195 100 L 210 100" stroke="#a5b4fc" strokeWidth="0.5" opacity="0.5"/>
                                <path d="M 195 120 L 210 105" stroke="#a5b4fc" strokeWidth="0.5" opacity="0.5"/>
                                <path d="M 195 140 L 210 110" stroke="#a5b4fc" strokeWidth="0.5" opacity="0.5"/>
                                <path d="M 225 100 L 235 100" stroke="#a5b4fc" strokeWidth="0.5" opacity="0.5"/>
                                <rect x="265" y="85" width="25" height="30" rx="5" fill="url(#grad2)" className="pulsing-node" style={{animationDelay: '0.4s'}}/>
                                <text x="270" y="105" fontFamily="Inter" fontSize="6" fill="white">Output</text>
                                <line x1="255" y1="100" x2="265" y2="100" stroke="#a5b4fc" strokeWidth="1" strokeDasharray="2,2"/>
                            </svg>
                         </div>
                     </div>
                </div>
            </MotionSection>

            {/* Contact Us Section */}
            <MotionSection id="contact">
                <div className="container mx-auto px-6">
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-12">
                        <div className="text-center mb-8">
                            <h3 className="text-4xl font-bold text-white mb-4">Get in Touch</h3>
                            <p className="text-indigo-200 max-w-2xl mx-auto">Have questions or want to learn more about partnerships? Send us a message.</p>
                        </div>
                        <form action="https://formsubmit.co/your@email.com" method="POST" className="max-w-xl mx-auto">
                             <input type="hidden" name="_captcha" value="false" />
                             <input type="hidden" name="_next" value={window.location.href} />
                             <div className="grid md:grid-cols-2 gap-6 mb-6">
                                 <input type="text" name="name" placeholder="Your Name" required className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white outline-none focus:border-indigo-500 focus:bg-white/15 transition" />
                                 <input type="email" name="email" placeholder="Your Email" required className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white outline-none focus:border-indigo-500 focus:bg-white/15 transition" />
                             </div>
                             <div className="mb-6">
                                 <textarea name="message" rows="5" placeholder="Your Message" required className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white outline-none focus:border-indigo-500 focus:bg-white/15 transition"></textarea>
                             </div>
                             <div className="text-center">
                                 <motion.button type="submit" className="bg-indigo-600 text-white font-bold px-10 py-4 rounded-xl hover:bg-indigo-500 transition text-lg shadow-lg shadow-indigo-600/30" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                     Send Message
                                 </motion.button>
                             </div>
                         </form>
                    </div>
                </div>
            </MotionSection>

            {/* Footer */}
            <footer className="bg-gray-900/50 border-t border-white/10 mt-20">
                <div className="container mx-auto px-6 py-8 text-center">
                    <p className="text-gray-400">&copy; {new Date().getFullYear()} PneumoDetect AI. All Rights Reserved.</p>
                    <p className="text-center text-xs text-gray-500 mt-8 max-w-3xl mx-auto">
                        Disclaimer: PneumoDetect AI is intended for informational and research purposes only and is not a substitute for professional medical advice, diagnosis, or treatment.
                    </p>
                </div>
            </footer>

            {/* Get Started Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setIsModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: -20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: -20 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="bg-[#16152d] border border-white/10 rounded-2xl shadow-2xl w-full max-w-md p-8"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-white">Get Started</h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition">
                                    <X size={24} />
                                </button>
                            </div>
                            <p className="text-gray-400 mb-8">Choose an option to continue and analyze a chest X-ray image.</p>
                            <div className="space-y-4">
                                <motion.button onClick={() => handleNavigation('/register')} whileHover={{ scale: 1.03 }} className="w-full flex items-center gap-4 text-left p-4 bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/50 rounded-lg text-white transition-colors">
                                    <UserPlus className="text-indigo-400" size={24} />
                                    <div><h4 className="font-bold">Create Account</h4><p className="text-sm text-gray-400">Sign up to save your prediction history.</p></div>
                                </motion.button>
                                <motion.button onClick={() => handleNavigation('/login')} whileHover={{ scale: 1.03 }} className="w-full flex items-center gap-4 text-left p-4 bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/50 rounded-lg text-white transition-colors">
                                    <LogIn className="text-indigo-400" size={24} />
                                    <div><h4 className="font-bold">Login</h4><p className="text-sm text-gray-400">Access your existing account and history.</p></div>
                                </motion.button>
                                <motion.button onClick={() => handleNavigation('/guest-predict')} whileHover={{ scale: 1.03 }} className="w-full flex items-center gap-4 text-left p-4 bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/50 rounded-lg text-white transition-colors">
                                    <User className="text-indigo-400" size={24} />
                                    <div><h4 className="font-bold">Continue as Guest</h4><p className="text-sm text-gray-400">Try a one-time prediction without an account.</p></div>
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default LandingPage;
