import React, { useState, useCallback, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from 'react-router-dom';
import { apiCall } from "../services/api";
import {
  UploadCloud,
  Activity,
  X,
  Info,
  Loader,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { TbLungs } from 'react-icons/tb';


const Toast = ({ message, type, onClose }) => {
  const toastColor = type === "error" ? "bg-red-500" : type === "info" ? "bg-blue-500" : "bg-green-500";
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`fixed bottom-5 right-5 p-4 rounded-lg text-white shadow-lg ${toastColor}`}
    >
      {message}
    </motion.div>
  );
};

const GuestWarningModal = ({ isOpen, onClose }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-xl w-full max-w-md p-8 relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition-colors"
          >
            <X size={24} />
          </button>
          <div className="flex flex-col items-center text-center">
            <Info size={48} className="text-indigo-400 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              You are in Guest Mode
            </h2>
            <p className="text-gray-400 mb-6">
              Your analysis history will not be saved. To keep a record of your
              results, please create an account.
            </p>
            <div className="w-full space-y-3">
              <Link
                to="/register"
                className="block w-full text-center bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold py-2.5 rounded-lg shadow-md hover:brightness-110 transition-all"
              >
                Create Account
              </Link>
              <button
                onClick={onClose}
                className="w-full bg-slate-700 text-white font-semibold py-2.5 rounded-lg hover:bg-slate-600 transition-colors"
              >
                Continue as Guest
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const ResultModal = ({ isOpen, onClose, prediction }) => {
  if (!isOpen || !prediction) return null;

  const isPneumonia = prediction.disease === "Pneumonia";
  const confidence = prediction.confidence || 0;
  const confidenceColor = isPneumonia ? "bg-red-500" : "bg-green-500";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 p-8 rounded-2xl shadow-lg w-full max-w-lg relative"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition-colors"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Analysis Result
            </h2>
            <div className="space-y-5">
              <div className="flex items-center text-lg">
                <TbLungs
                  className={`h-8 w-8 ${
                    isPneumonia ? "text-red-400" : "text-green-400"
                  } mr-4 flex-shrink-0`}
                />
                <div>
                  <span className="font-semibold text-gray-400">
                    Prediction:
                  </span>
                  <p
                    className={`text-2xl font-bold ${
                      isPneumonia ? "text-red-400" : "text-green-400"
                    }`}
                  >
                    {prediction.disease === "Normal"
                      ? "No Pneumonia Detected"
                      : prediction.disease}
                  </p>
                </div>
              </div>
              <div className="flex items-center text-lg">
                <Activity className="h-8 w-8 text-indigo-400 mr-4 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-gray-400">
                    Confidence Score:
                  </span>
                  <p className="text-2xl font-bold text-white">
                    {confidence.toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <div className="w-full bg-slate-700 rounded-full h-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${confidence}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={`h-4 rounded-full ${confidenceColor}`}
                />
              </div>
            </div>
            <div className="mt-8 text-center">
              <button
                onClick={onClose}
                className="w-full sm:w-auto font-bold py-3 px-8 rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:brightness-110 transform hover:-translate-y-px"
              >
                <RefreshCw size={18} />
                Analyze Another X-Ray
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- Main Guest Page Component ---
const GuestPage = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const analyzeButtonRef = useRef(null);
  const hasGuestVisitedThisSession = useRef(false);

  useEffect(() => {
    if (!hasGuestVisitedThisSession.current) {
      setIsWarningOpen(true);
      hasGuestVisitedThisSession.current = true;
    }
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type, id: Date.now() });
  };

  const resetState = () => {
    setFile(null);
    setPreview(null);
    setPrediction(null);
    setIsResultModalOpen(false);
  };

  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    resetState();
    if (fileRejections.length > 0) {
      showToast("Invalid file type. Please upload an image (jpeg, png).", "error");
      return;
    }
    const selectedFile = acceptedFiles[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));

    setTimeout(() => {
      analyzeButtonRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  }, []);

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    resetState();
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [], "image/png": [] },
    multiple: false,
  });

  // --- UPDATED API CALL LOGIC using apiCall service ---
  const handleAnalyze = async () => {
    if (!file) {
      // Use react-hot-toast directly for simple, non-API-related feedback
      import('react-hot-toast').then(toast => toast.error("Please select a file first."));
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await apiCall('post', '/guest-predict', formData);

      setPrediction(response);
      setIsResultModalOpen(true);
      showToast("Analysis complete!", "success");

    } catch (error) {
      // Error toast is already handled by the apiCall service
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a091e] text-gray-200 flex flex-col font-sans">
      <GuestWarningModal
        isOpen={isWarningOpen}
        onClose={() => setIsWarningOpen(false)}
      />
      <ResultModal
        isOpen={isResultModalOpen}
        onClose={resetState}
        prediction={prediction}
      />
      <AnimatePresence>
        {toast && (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>

      <header className="w-full p-4 sm:p-6 bg-[#0a091e]/80 backdrop-blur-md shadow-sm fixed top-0 z-40 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <TbLungs className="w-8 h-8 text-indigo-400" />
            <span className="text-2xl font-bold text-white">
              PneumoDetect AI
            </span>
          </Link>
          <Link
            to="/"
            className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-8 pt-24 sm:pt-32">
        <div className="w-full max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Guest Analysis
            </h1>
            <p className="text-lg text-gray-400 mt-2">
              Upload a chest X-ray to get an instant AI-powered analysis.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 w-full"
          >
            <div
              {...getRootProps()}
              className={`relative border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 p-4
                                  ${
                                    isDragActive
                                      ? "border-indigo-500 bg-slate-800/50"
                                      : "border-slate-700 bg-slate-900/50 hover:border-indigo-600"
                                  }`}
            >
              <input {...getInputProps()} />
              <AnimatePresence>
                {preview ? (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="relative"
                  >
                    <img
                      src={preview}
                      alt="X-Ray Preview"
                      className="rounded-lg w-full h-auto max-h-96 object-contain"
                    />
                    <button
                      onClick={handleRemoveFile}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2 shadow-lg hover:bg-red-700 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col justify-center items-center text-center p-10 h-60"
                  >
                    <UploadCloud className="h-16 w-16 text-gray-500 mb-4" />
                    <p className="text-gray-400">
                      {isDragActive
                        ? "Drop the image here..."
                        : "Drag & drop X-ray here, or click to select"}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Supports: PNG, JPG
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              ref={analyzeButtonRef}
              onClick={handleAnalyze}
              disabled={!file || loading}
              className="w-full font-bold py-3 px-8 rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white hover:brightness-110 transform hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze Scan"
              )}
            </button>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
export default GuestPage;