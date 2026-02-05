import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUserPlus, FaSave, FaTimes, FaGlobeAmericas } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import {
  getAvatarPath, PROFILE_IMAGES, CITIES, ENDPOINTS, HIDE_PERSONAL_DEFAULT,
  GENDER_TYPES, SEXUAL_ORIENTATIONS, CITIZENSHIPS, RACES, RELATIONSHIP_TYPES
} from '../../utils/constants';
import { apiCall } from '../../utils/api';

const AddMemberForm = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', dob: '', location: '', pic: 'default-profile.png',
    hide_personal: HIDE_PERSONAL_DEFAULT,
    gender: 'Male', orientation: 'Heterosexual', citizenship: 'Indian', race: 'Asian',
    relationship_type: 'Other' // Default Relation
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) return toast.error("Name is required");

    setLoading(true);
    try {
      await apiCall('POST', ENDPOINTS.FAMILY_ADD, formData);
      toast.success("Family Member Added!");
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      // handled in api
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="bg-[#1a1a2e] border border-white/10 rounded-2xl p-6 max-w-4xl w-full mx-auto relative shadow-2xl h-[90vh] flex flex-col"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-4 shrink-0">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <FaUserPlus className="text-purple-500" /> New Member Profile
        </h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white"><FaTimes /></button>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-6">

        {/* Section 1: Basic Info & Picture */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Image Selector */}
          <div className="md:col-span-1 space-y-2">
            <label className="text-xs text-purple-300">Profile Picture</label>
            <div className="bg-black/30 p-2 rounded-xl border border-white/10 h-48 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-3 gap-2">
                {PROFILE_IMAGES.map((img, idx) => (
                  <img
                    key={idx}
                    src={getAvatarPath(img)?getAvatarPath(img):getAvatarPath('default-profile.png')}
                    // 👇 ADD THIS LINE for the "default thing"
                    onError={(e) => {
                      e.target.onerror = null; // Safety: Prevents infinite loop if default image also breaks
                      e.target.src = getAvatarPath('default-profile.png'); // Loads the default image
                    }}
                    onClick={() => !isView && setFormData({ ...formData, pic: img })}
                    className={`w-12 h-12 rounded-full object-cover cursor-pointer border-2 transition-all 
    ${formData.pic === img ? 'border-purple-500 opacity-100' : 'border-transparent opacity-50 hover:opacity-100'}
  `}
                  />
                  // <img 
                  //   key={idx}
                  //   src={getAvatarPath(img)} // 👈 USE HELPER HERE                      onClick={() => setFormData({...formData, pic: img})}
                  //   className={`w-12 h-12 rounded-full object-cover cursor-pointer border-2 transition-all ${formData.pic === img ? 'border-purple-500 opacity-100' : 'border-transparent opacity-50 hover:opacity-100'}`}
                  //   onError={(e) => e.target.src = '/user/default-profile.png'}
                  // />
                ))}
              </div>
            </div>
          </div>

          {/* Core Inputs */}
          <div className="md:col-span-2 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-xs text-gray-400 block mb-1">Full Name *</label><input name="name" value={formData.name} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-purple-500 outline-none" placeholder="Rupesh KLR" /></div>
              <div><label className="text-xs text-gray-400 block mb-1">Phone</label><input name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-purple-500 outline-none" placeholder="+91..." /></div>
              <div><label className="text-xs text-gray-400 block mb-1">Email</label><input name="email" value={formData.email} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-purple-500 outline-none" placeholder="user@klr.com" /></div>
              <div><label className="text-xs text-gray-400 block mb-1">DOB</label><input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-purple-500 outline-none" /></div>
            </div>
          </div>
        </div>

        <hr className="border-white/5" />

        {/* Section 2: Demographics */}
        <div>
          <h3 className="text-sm font-bold text-gray-300 mb-3 flex items-center gap-2"><FaGlobeAmericas /> Demographics & Identity</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Gender */}
            <div>
              <label className="text-xs text-gray-400 block mb-1">Gender Identity</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-purple-500 outline-none">
                {GENDER_TYPES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            {/* Orientation */}
            <div>
              <label className="text-xs text-gray-400 block mb-1">Sexual Orientation</label>
              <select name="orientation" value={formData.orientation} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-purple-500 outline-none">
                {SEXUAL_ORIENTATIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Relationship Role */}
            <div>
              <label className="text-xs text-gray-400 block mb-1">Relation to Head</label>
              <select name="relationship_type" value={formData.relationship_type} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-purple-500 outline-none">
                {RELATIONSHIP_TYPES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            {/* Citizenship */}
            <div>
              <label className="text-xs text-gray-400 block mb-1">Citizenship</label>
              <select name="citizenship" value={formData.citizenship} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-purple-500 outline-none">
                {CITIZENSHIPS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Race */}
            <div>
              <label className="text-xs text-gray-400 block mb-1">Race / Ethnicity</label>
              <select name="race" value={formData.race} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-purple-500 outline-none">
                {RACES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="text-xs text-gray-400 block mb-1">Current Location</label>
              <select name="location" value={formData.location} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-purple-500 outline-none">
                <option value="">Select City</option>
                {CITIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex gap-3 pt-4 border-t border-white/10 mt-auto shrink-0">
          <div className="flex items-center gap-2 mr-auto">
            <input type="checkbox" name="hide_personal" checked={formData.hide_personal} onChange={handleChange} className="accent-purple-500" />
            <label className="text-xs text-gray-400">Hide Contact Info</label>
          </div>

          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-gray-300 transition-colors">Cancel</button>
          <button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors">
            {loading ? "Saving..." : <><FaSave /> Save Profile</>}
          </button>
        </div>

      </form>
    </motion.div>
  );
};

export default AddMemberForm;