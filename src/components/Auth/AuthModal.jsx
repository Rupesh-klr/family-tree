import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { loginSimulate } from '../../store/authSlice';
import { toast } from 'react-hot-toast';
import { FaTimes, FaLock } from 'react-icons/fa';

const AuthModal = ({ onClose }) => {
  const dispatch = useDispatch();

  const handleAction = (type) => {
    toast.success(`${type} Successful! Redirecting...`);
    dispatch(loginSimulate());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white/10 border border-white/20 backdrop-blur-xl p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white"><FaTimes/></button>
        
        <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-500/50">
           <FaLock className="text-purple-300 text-2xl" />
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">Coming Soon</h2>
        <p className="text-gray-300 text-sm mb-6">Join the Society securely.</p>

        <div className="space-y-3">
          <button 
            onClick={() => handleAction('Login')}
            className="w-full bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-purple-500/25"
          >
            Log In
          </button>
          <button 
            onClick={() => handleAction('Signup')}
            className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3 rounded-xl font-bold transition-all"
          >
            Sign Up
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthModal;
