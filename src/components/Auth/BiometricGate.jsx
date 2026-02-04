import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaFingerprint, FaLock } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
// 👇 FIX IMPORT: Change vaultSlice to authSlice
import { recordBiometricAuth } from '../../store/authSlice';

const ENABLE_SCREEN_LOCK = true; 

const BiometricGate = ({ children }) => {
  const dispatch = useDispatch();
  
  // 👇 FIX SELECTOR: Read from state.auth, not state.vault
  const { biometricPrefs, isAuthenticated } = useSelector(state => state.auth);
  
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [loading, setLoading] = useState(false);

  // Helper: Calculate if Auth is needed
  const isAuthRequired = () => {
    // If user isn't logged in, no need to lock screen (Login modal handles it)
    if (!isAuthenticated) return false; 
    if (!ENABLE_SCREEN_LOCK) return false;
    
    const { interval, lastAuthTime } = biometricPrefs;
    if (interval === 'always') return true;
    if (!lastAuthTime) return true;

    const now = Date.now();
    const elapsed = now - lastAuthTime;
    
    const ONE_HOUR = 60 * 60 * 1000;
    const ONE_DAY = 24 * ONE_HOUR;

    let maxDuration = 0;
    switch(interval) {
        case '24h': maxDuration = ONE_DAY; break;
        case '48h': maxDuration = 2 * ONE_DAY; break;
        case '72h': maxDuration = 3 * ONE_DAY; break;
        case '1w':  maxDuration = 7 * ONE_DAY; break;
        case '2w':  maxDuration = 14 * ONE_DAY; break;
        case '1m':  maxDuration = 30 * ONE_DAY; break;
        default: return true; 
    }

    return elapsed > maxDuration;
  };

  useEffect(() => {
    if (!isAuthRequired()) {
        setIsUnlocked(true);
    } else {
        triggerBiometricPrompt();
    }
  }, [isAuthenticated]); // Re-check when login status changes

  const triggerBiometricPrompt = async () => {
    setLoading(true);
    try {
      if (!window.PublicKeyCredential) {
        // Fallback for devices without biometric hardware
        // For development, we just auto-unlock
        dispatch(recordBiometricAuth());
        setIsUnlocked(true);
        return;
      }

      // --- WEBAUTHN SIMULATION ---
      // In a real app, you would call navigator.credentials.create() here.
      // For this demo, we simulate a delay and success.
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      dispatch(recordBiometricAuth());
      setIsUnlocked(true);
      toast.success("Identity Verified");

    } catch (error) {
      console.error(error);
      toast.error("Authentication Failed");
    } finally {
      setLoading(false);
    }
  };

  if (isUnlocked) return children;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050510] text-white p-4 backdrop-blur-md">
       <div className="bg-white/5 border border-white/10 p-8 rounded-2xl flex flex-col items-center shadow-2xl">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 animate-pulse">
             <FaLock className="text-3xl text-red-500" />
          </div>
          <h2 className="text-xl font-bold mb-2">Security Check</h2>
          <p className="text-gray-400 text-sm mb-6 text-center max-w-[200px]">
            Please verify your identity to access family records.
          </p>
          <button 
            onClick={triggerBiometricPrompt} 
            disabled={loading}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 px-6 py-2 rounded-lg font-bold transition-all"
          >
            {loading ? "Verifying..." : <><FaFingerprint /> Unlock</>}
          </button>
       </div>
    </div>
  );
};

export default BiometricGate;