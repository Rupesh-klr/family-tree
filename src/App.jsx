import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Toaster, toast } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion'; 
import { FaFileUpload, FaUserPlus, FaEye, FaPencilAlt, FaTrash } from 'react-icons/fa';

// Imports
import { getAvatarPath } from './utils/constants';
import Navbar from './components/Layout/Navbar';
import AddMemberForm from './components/Forms/AddMemberForm'; 
import ImportMemberForm from './components/Forms/ImportMemberForm'; 
import { ROLES } from './utils/roles';
import DB from './data/DB.json'; 
import { apiCall } from './utils/api'; 
import { ENDPOINTS } from './utils/constants';

function App() {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  
  // Modal States
  const [showAddForm, setShowAddForm] = useState(false);
  const [showImportForm, setShowImportForm] = useState(false);
  
  // Data States
  const [members, setMembers] = useState([]);
  
  // Selection States for Edit/View
  const [selectedMember, setSelectedMember] = useState(null); 
  const [isViewMode, setIsViewMode] = useState(false); 

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = () => {
    const localData = localStorage.getItem('family_tree_db');
    if (localData) {
      setMembers(JSON.parse(localData).members);
    } else {
      setMembers(DB.members);
    }
  };

  const refreshList = () => {
    loadMembers();
  };

  // 🖱️ HANDLERS
  const handleEdit = (member) => {
    setSelectedMember(member);
    setIsViewMode(false);
    setShowAddForm(true);
  };

  const handleView = (member) => {
    setSelectedMember(member);
    setIsViewMode(true);
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if(!confirm("Are you sure you want to permanently delete this record?")) return;
    
    try {
        await apiCall('DELETE', ENDPOINTS.FAMILY_ADD, { id });
        toast.success("Record Deleted");
        refreshList();
    } catch(e) {
        toast.error("Delete Failed");
    }
  };

  const closeForm = () => {
    setShowAddForm(false);
    setSelectedMember(null);
    setIsViewMode(false);
  };

  return (
    <div className="min-h-screen bg-[#050510] text-white pt-20">
      <Navbar />

      <main className="p-4 md:p-8 max-w-7xl mx-auto">
        {/* HERO SECTION */}
        <div className="text-center mb-12">
           <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 mb-4">{DB.society_name}</h1>
           <p className="text-gray-400">Preserving our history for the future.</p>
        </div>

        {!isAuthenticated ? (
           <div className="glass-card p-12 text-center border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm">
              <p className="text-xl text-gray-300">Please Login to view the Family Tree.</p>
           </div>
        ) : (
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* SIDEBAR */}
              <div className="bg-[#1a1a2e] p-6 rounded-2xl border border-white/10 h-fit sticky top-24">
                 <h3 className="text-purple-400 font-bold mb-4">Quick Actions</h3>
                 <ul className="space-y-3 text-sm text-gray-400">
                    <li className="hover:text-white cursor-pointer transition-colors p-2 hover:bg-white/5 rounded">My Profile</li>
                    <li onClick={() => { setSelectedMember(null); setIsViewMode(false); setShowAddForm(true); }} className="hover:text-white cursor-pointer transition-colors p-2 hover:bg-white/5 rounded flex items-center gap-2 text-white font-semibold">
                      <FaUserPlus className="text-green-400"/> Add Member
                    </li>
                    <li onClick={() => setShowImportForm(true)} className="hover:text-white cursor-pointer transition-colors p-2 hover:bg-white/5 rounded flex items-center gap-2 text-white font-semibold">
                      <FaFileUpload className="text-blue-400"/> Bulk Import
                    </li>
                 </ul>
              </div>

              {/* LIST AREA */}
              <div className="md:col-span-2 bg-[#1a1a2e]/50 p-6 rounded-2xl border border-white/10 min-h-[500px]">
                 <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Family Hierarchy</h2>
                    <span className="text-xs text-gray-500 bg-black/30 px-3 py-1 rounded-full">{members.length} Members</span>
                 </div>
                 
                 <div className="space-y-4">
                    {members.map((member) => (
                      <div key={member.id} className="bg-black/40 p-4 rounded-xl border border-white/5 flex items-center gap-4 hover:border-purple-500/30 transition-colors group">
                        
                        {/* 🖼️ FIXED IMAGE LOGIC */}
                        <img 
                          src={getAvatarPath("default-profile.png")} 
                          // src={getAvatarPath(member.pic)} 
                          alt={member.name}
                          className="w-12 h-12 rounded-full object-cover border border-purple-500/30"
                          // If the specific image fails to load, force the default one
                          onError={(e) => {
                            e.target.onerror = null; 
                            e.target.src = getAvatarPath('default-profile.png'); 
                          }}
                        />
                         
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-200">{member.name}</h4>
                          <div className="flex gap-3 text-xs text-gray-500 mt-1">
                             <span>📍 {member.location || "Unknown"}</span>
                             {member.relationship_type && <span className="text-purple-400">🔗 {member.relationship_type}</span>}
                          </div>
                        </div>

                        {/* 🛠️ ACTION BUTTONS */}
                        <div className="flex items-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleView(member)} className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition-colors" title="View Details">
                                <FaEye />
                            </button>

                            {user.role === ROLES.SUPER_ADMIN && (
                                <>
                                    <button onClick={() => handleEdit(member)} className="p-2 bg-yellow-500/10 text-yellow-400 rounded-lg hover:bg-yellow-500 hover:text-white transition-colors" title="Edit">
                                        <FaPencilAlt />
                                    </button>
                                    <button onClick={() => handleDelete(member.id)} className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-colors" title="Delete">
                                        <FaTrash />
                                    </button>
                                </>
                            )}
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        )}
      </main>

      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <AddMemberForm 
              onClose={closeForm} 
              onSuccess={refreshList}
              initialData={selectedMember} 
              readOnly={isViewMode}        
              allMembers={members}         
            />
          </div>
        )}

        {showImportForm && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <ImportMemberForm onClose={() => setShowImportForm(false)} onSuccess={refreshList}/>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;