import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion'; // For smooth modal fade-in

import Navbar from './components/Layout/Navbar';
import AddMemberForm from './components/Forms/AddMemberForm'; // 👈 IMPORT THE FORM
import { ROLES } from './utils/roles';
import DB from './data/DB.json'; 

function App() {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  
  // 👇 1. STATE TO CONTROL THE MODAL
  const [showAddForm, setShowAddForm] = useState(false);
  
  // State to hold the member list (so it updates immediately when you add someone)
  const [members, setMembers] = useState([]);

  // Load initial data (Simulating fetch)
  useEffect(() => {
    const localData = localStorage.getItem('family_tree_db');
    if (localData) {
      setMembers(JSON.parse(localData).members);
    } else {
      setMembers(DB.members);
    }
  }, []);

  // Function to refresh list after adding
  const refreshList = () => {
    const localData = JSON.parse(localStorage.getItem('family_tree_db'));
    if (localData) setMembers(localData.members);
  };

  return (
    <div className="min-h-screen bg-[#050510] text-white pt-20">
      <Navbar />

      <main className="p-4 md:p-8 max-w-7xl mx-auto">
        
        {/* HERO */}
        <div className="text-center mb-12">
           <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 mb-4">
             {DB.society_name}
           </h1>
           <p className="text-gray-400">Preserving our history for the future.</p>
        </div>

        {/* CONTENT */}
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
                    <li className="hover:text-white cursor-pointer transition-colors p-2 hover:bg-white/5 rounded">
                      My Profile
                    </li>
                    
                    {/* 👇 2. CLICK HANDLER ADDED HERE */}
                    <li 
                      onClick={() => setShowAddForm(true)} 
                      className="hover:text-white cursor-pointer transition-colors p-2 hover:bg-white/5 rounded flex items-center gap-2 text-white font-semibold"
                    >
                      <span className="text-green-400">+</span> Add Member
                    </li>

                    {user.role === ROLES.SUPER_ADMIN && (
                       <li className="text-yellow-400 font-bold mt-4 pt-4 border-t border-white/10">
                         ⚡ Admin Controls
                       </li>
                    )}
                 </ul>
              </div>

              {/* MAIN DISPLAY AREA */}
              <div className="md:col-span-2 bg-[#1a1a2e]/50 p-6 rounded-2xl border border-white/10 min-h-[500px]">
                 <h2 className="text-2xl font-bold mb-6">Family Hierarchy</h2>
                 
                 {/* SIMPLE LIST VIEW FOR NOW */}
                 <div className="space-y-4">
                    {members.map((member) => (
                      <div key={member.id} className="bg-black/40 p-4 rounded-xl border border-white/5 flex items-center gap-4">
                        <img 
                          src={`/user/${member.pic}`} 
                          onError={(e) => e.target.src = '/user/default-profile.png'}
                          className="w-12 h-12 rounded-full object-cover border border-purple-500/30"
                        />
                        <div>
                          <h4 className="font-bold text-gray-200">{member.name}</h4>
                          <p className="text-xs text-gray-500">{member.location || "Unknown Location"}</p>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        )}

      </main>

      {/* 👇 3. THE POPUP MODAL */}
      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <AddMemberForm 
              onClose={() => setShowAddForm(false)} 
              onSuccess={refreshList}
            />
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default App;