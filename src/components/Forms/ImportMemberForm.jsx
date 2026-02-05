import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaFileUpload, FaDownload, FaTimes, FaFileCsv, FaFileExcel, FaCode } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { v4 as uuidv4 } from 'uuid';
import { IMPORT_TEMPLATES } from '../../utils/constants';
import { apiCall } from '../../utils/api';
import { ENDPOINTS } from '../../utils/constants';

const ImportMemberForm = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Helper: Validate & Normalize Data
  const normalizeData = (rawData) => {
    return rawData.map(item => {
      // 1. UUID Check
      let finalId = item.id;
      if (!finalId || finalId.length < 10) { 
        finalId = uuidv4(); // Generate new if missing or too short
      }

      // 2. Default Image
      const finalPic = item.pic || "default-profile.png";

      // 3. Boolean Conversion (Excel often reads "TRUE" as string)
      const hidePersonal = String(item.hide_personal).toLowerCase() === 'true';

      return {
        id: finalId,
        name: item.name || "Unknown Name",
        phone: item.phone || "",
        email: item.email || "",
        dob: item.dob || "", // Ideally format YYYY-MM-DD
        location: item.location || "",
        pic: finalPic,
        hide_personal: hidePersonal,
        gender: item.gender || "Other",
        citizenship: item.citizenship || "Indian",
        timestamp: new Date().toISOString() // Force timestamp
      };
    });
  };

  const processFile = async (file) => {
    setLoading(true);
    const reader = new FileReader();

    reader.onload = async (e) => {
      let parsedData = [];
      try {
        if (file.name.endsWith('.json')) {
          parsedData = JSON.parse(e.target.result);
        } else if (file.name.endsWith('.csv')) {
          const csvResult = Papa.parse(e.target.result, { header: true, skipEmptyLines: true });
          parsedData = csvResult.data;
        } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
          const workbook = XLSX.read(e.target.result, { type: 'binary' });
          const sheetName = workbook.SheetNames[0]; // Take first sheet
          parsedData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        } else {
          throw new Error("Unsupported file format");
        }

        // Validate List
        if (!Array.isArray(parsedData) && !parsedData.length) {
          throw new Error("File appears empty or invalid format");
        }

        const cleanData = normalizeData(parsedData);
        
        // 🚀 Loop Simulation for Mock DB (or replace with bulk endpoint)
        let successCount = 0;
        for (const member of cleanData) {
             await apiCall('POST', ENDPOINTS.FAMILY_ADD, member);
             successCount++;
        }

        toast.success(`Successfully imported ${successCount} members!`);
        if (onSuccess) onSuccess();
        onClose();

      } catch (err) {
        toast.error("Import Failed: " + err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      reader.readAsBinaryString(file);
    } else {
      reader.readAsText(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
      className="bg-[#1a1a2e] border border-white/20 rounded-2xl p-6 max-w-lg w-full relative shadow-2xl"
    >
      <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white"><FaTimes/></button>
      
      <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
        <FaFileUpload className="text-blue-500"/> Bulk Import
      </h2>
      <p className="text-xs text-gray-400 mb-6">Support JSON, CSV, XLSX. Max 5MB.</p>

      {/* Drop Zone */}
      <div 
        onDragEnter={() => setDragActive(true)}
        onDragLeave={() => setDragActive(false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl h-40 flex flex-col items-center justify-center transition-colors mb-6
          ${dragActive ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 bg-black/20'}
        `}
      >
        {loading ? (
             <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"/>
        ) : (
            <>
              <p className="text-sm text-gray-300 mb-2">Drag & Drop file here</p>
              <span className="text-xs text-gray-500">OR</span>
              <label className="mt-2 bg-white/10 hover:bg-white/20 px-4 py-1 rounded text-xs cursor-pointer text-white transition-colors">
                 Browse File
                 <input type="file" className="hidden" accept=".json,.csv,.xlsx,.xls" onChange={(e) => processFile(e.target.files[0])} />
              </label>
            </>
        )}
      </div>

      {/* Templates Download */}
      <div className="bg-white/5 rounded-lg p-3">
        <label className="text-xs text-gray-400 block mb-2 font-bold uppercase tracking-wider">Download Templates</label>
        <div className="flex gap-2">
            <a href={IMPORT_TEMPLATES.JSON} download className="flex-1 flex items-center justify-center gap-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 py-2 rounded text-xs border border-yellow-500/30 transition-colors">
               <FaCode /> JSON
            </a>
            <a href={IMPORT_TEMPLATES.CSV} download className="flex-1 flex items-center justify-center gap-2 bg-green-500/10 hover:bg-green-500/20 text-green-500 py-2 rounded text-xs border border-green-500/30 transition-colors">
               <FaFileCsv /> CSV
            </a>
            <a href={IMPORT_TEMPLATES.XLSX} download className="flex-1 flex items-center justify-center gap-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 py-2 rounded text-xs border border-blue-500/30 transition-colors">
               <FaFileExcel /> Excel
            </a>
        </div>
      </div>
    </motion.div>
  );
};

export default ImportMemberForm;