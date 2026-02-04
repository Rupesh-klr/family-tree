import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import { FaBars, FaTimes, FaUserCircle } from 'react-icons/fa';
import AuthModal from '../Auth/AuthModal';
import { logout } from '../../store/authSlice';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Random 8 chars from email for display
  const displayEmail = user ? user.email.substring(0, 8) + "..." : "";

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-16 bg-[#0f0c29]/80 backdrop-blur-md border-b border-white/10 z-50 flex items-center justify-between px-4 md:px-8">
        
        {/* Logo */}
        <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 cursor-pointer">
          KLR Society
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
           {isAuthenticated ? (
             <div className="flex items-center gap-3 bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
                <img src={user.pic} alt="Profile" className="w-8 h-8 rounded-full border border-purple-500" />
                <span className="text-sm text-gray-300 font-mono">{displayEmail}</span>
                <button onClick={() => dispatch(logout())} className="text-xs text-red-400 hover:text-red-300 ml-2">Logout</button>
             </div>
           ) : (
             <button 
               onClick={() => setShowAuthModal(true)}
               className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-lg font-bold transition-all"
             >
               Login / Signup
             </button>
           )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white text-xl" onClick={() => setIsMobileMenuOpen(true)}>
          <FaBars />
        </button>
      </nav>

      {/* Mobile Sidebar (Z-Index Drawer) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => setIsMobileMenuOpen(false)}
               className="fixed inset-0 bg-black/80 z-[60] md:hidden"
            />
            <motion.div 
               initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
               className="fixed top-0 right-0 bottom-0 w-64 bg-[#1a1a2e] border-l border-white/10 z-[70] p-6 flex flex-col md:hidden"
            >
               <div className="flex justify-end mb-8">
                 <FaTimes className="text-white text-xl" onClick={() => setIsMobileMenuOpen(false)} />
               </div>

               {isAuthenticated ? (
                 <div className="flex flex-col items-center gap-4">
                    <img src={user.pic} className="w-20 h-20 rounded-full border-2 border-purple-500 shadow-[0_0_15px_purple]" />
                    <p className="text-gray-300 font-mono">{user.email}</p>
                    <button onClick={() => dispatch(logout())} className="w-full bg-red-500/20 text-red-400 py-2 rounded mt-4">Logout</button>
                 </div>
               ) : (
                 <button 
                   onClick={() => { setIsMobileMenuOpen(false); setShowAuthModal(true); }}
                   className="w-full bg-purple-600 text-white py-3 rounded-lg font-bold"
                 >
                   Login / Signup
                 </button>
               )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      </AnimatePresence>
    </>
  );
};

export default Navbar;