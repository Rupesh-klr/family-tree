import { IS_BACKEND_HOSTED, ENDPOINTS } from './constants';
import DB from '../data/DB.json'; // Seed data
import { toast } from 'react-hot-toast';

// Helper to simulate delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Universal Request Handler
 * @param {string} method - 'GET' | 'POST' | 'PUT' | 'DELETE'
 * @param {string} endpoint - API Endpoint from constants
 * @param {object} payload - Data to send (for POST/PUT)
 */
export const apiCall = async (method, endpoint, payload = null) => {
  console.log(`📡 API Request: [${method}] ${endpoint}`, payload);

  try {
    // ------------------------------------
    // CASE 1: REAL BACKEND (Future Proof)
    // ------------------------------------
    if (IS_BACKEND_HOSTED) {
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: payload ? JSON.stringify(payload) : undefined,
      });

      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      return await response.json();
    }

    // ------------------------------------
    // CASE 2: LOCAL MOCK (Dev Mode)
    // ------------------------------------
    else {
      await delay(800); // Fake network latency

      // 1. Initialize LocalStorage if empty (Seed from DB.json)
      const LOCAL_KEY = 'family_tree_db';
      let localData = JSON.parse(localStorage.getItem(LOCAL_KEY));
      
      if (!localData) {
        localData = DB;
        localStorage.setItem(LOCAL_KEY, JSON.stringify(DB));
      }

      // --- ROUTING MOCK LOGIC ---
      
      // GET: List Members
      if (endpoint === ENDPOINTS.FAMILY_LIST && method === 'GET') {
        return { status: 'success', data: localData.members };
      }

      // POST: Add Member
      if (endpoint === ENDPOINTS.FAMILY_ADD && method === 'POST') {
        const newMember = {
          id: crypto.randomUUID(),
          ...payload,
          timestamp: new Date().toISOString()
        };

        // Update Local State
        localData.members.push(newMember);
        localStorage.setItem(LOCAL_KEY, JSON.stringify(localData));

        // 💡 NOTE ON GITHUB ACTIONS:
        // To update GitHub DB.json, you would trigger a dispatch event here
        // using fetch('https://api.github.com/repos/OWNER/REPO/dispatches', ...)
        // We will stick to LocalStorage for now as it's safer for frontend.

        return { status: 'success', message: 'Member added successfully', data: newMember };
      }

      throw new Error(`Mock endpoint not found: ${endpoint}`);
    }

  } catch (error) {
    console.error("❌ API Error:", error);
    toast.error(error.message || "Network Error");
    throw error; // Re-throw so component can handle 'finally'
  } finally {
    console.log(`🏁 API Request Finished: ${endpoint}`);
  }
};