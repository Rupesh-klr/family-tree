import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUserPlus, FaSave, FaTimes, FaMapMarkerAlt } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { PROFILE_IMAGES, CITIES, ENDPOINTS, HIDE_PERSONAL_DEFAULT } from '../../utils/constants';
import { apiCall } from '../../utils/api';

const AddMemberForm = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    dob: '',
    location: '',
    pic: 'default-profile.png',
    hide_personal: HIDE_PERSONAL_DEFAULT
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageSelect = (imgName) => {
    setFormData(prev => ({ ...prev, pic: imgName }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return toast.error("Name and Phone are required");

    setLoading(true);
    try {
      await apiCall('POST', ENDPOINTS.FAMILY_ADD, formData);
      toast.success("Family Member Added!");
      if (onSuccess) onSuccess(); // Refresh parent list
      onClose();
    } catch (err) {
      // Error handled in apiCall already
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="bg-[#1a1a2e] border border-white/10 rounded-2xl p-6 max-w-2xl w-full mx-auto relative shadow-2xl"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <FaUserPlus className="text-purple-500" /> Add Family Member
        </h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white"><FaTimes /></button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* 1. Image Selector (Scrollable Grid) */}
        <div>
          <label className="text-xs text-purple-300 block mb-2">Select Profile Picture</label>
          <div className="bg-black/30 p-4 rounded-xl border border-white/10 h-32 overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              {PROFILE_IMAGES.map((img, idx) => (
                <div 
                  key={idx}
                  onClick={() => handleImageSelect(img)}
                  className={`cursor-pointer rounded-lg p-1 border-2 transition-all relative group
                    ${formData.pic === img ? 'border-purple-500 bg-purple-500/20' : 'border-transparent hover:border-white/20'}
                  `}
                >
                  <img 
                    src={`/user/${img}`} // Assuming images are in public/user/
                    alt="avatar" 
                    className="w-10 h-10 mx-auto rounded-full object-cover"
                    onError={(e) => e.target.src = '/user/default-profile.png'}
                  />
                  {/* Tooltip for filename */}
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 text-[10px] bg-black text-white rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none z-10">
                    {img}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-[10px] text-gray-500 mt-1 text-right">Selected: {formData.pic}</p>
        </div>

        {/* 2. Personal Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-400 block mb-1">Full Name *</label>
            <input name="name" value={formData.name} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-purple-500 outline-none" placeholder="e.g. Rupesh KLR" />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Phone Number *</label>
            <input name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-purple-500 outline-none" placeholder="+91 999..." />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Email ID</label>
            <input name="email" value={formData.email} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-purple-500 outline-none" placeholder="user@example.com" />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Date of Birth</label>
            <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-purple-500 outline-none" />
          </div>
        </div>

        {/* 3. Location (Tiered Cities) */}
        <div>
          <label className="text-xs text-gray-400 block mb-1 flex items-center gap-1"><FaMapMarkerAlt/> Current Location</label>
          <select name="location" value={formData.location} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-purple-500 outline-none appearance-none cursor-pointer">
            <option value="" className="bg-[#1a1a2e]">Select City</option>
            {/* Group by Tier for better UX */}
            <optgroup label="Tier 1 (Metros)" className="bg-[#1a1a2e]">
              {CITIES.filter(c => c.tier === 1).map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
            </optgroup>
            <optgroup label="Tier 2 (Developing)" className="bg-[#1a1a2e]">
              {CITIES.filter(c => c.tier === 2).map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
            </optgroup>
            <optgroup label="Tier 3 (Emerging)" className="bg-[#1a1a2e]">
              {CITIES.filter(c => c.tier === 3).map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
            </optgroup>
          </select>
        </div>

        {/* 4. Privacy Toggle */}
        <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/10">
          <input 
            type="checkbox" 
            name="hide_personal" 
            checked={formData.hide_personal} 
            onChange={handleChange}
            id="privacy_toggle"
            className="w-4 h-4 accent-purple-500 cursor-pointer"
          />
          <label htmlFor="privacy_toggle" className="text-sm text-gray-300 cursor-pointer select-none">
            Hide Personal Contact Info (Privacy Mode)
          </label>
        </div>

        {/* Footer Actions */}
        <div className="flex gap-3 pt-4 border-t border-white/10">
          <button type="button" onClick={onClose} className="flex-1 px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-gray-300 transition-colors">Cancel</button>
          <button 
            type="submit" 
            disabled={loading}
            className="flex-1 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
          >
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FaSave />}
            Save Member
          </button>
        </div>

      </form>
    </motion.div>
  );
};

export default AddMemberForm;