// ==========================================
// 1. APP CONFIGURATION
// ==========================================
export const IS_BACKEND_HOSTED = false; // Toggle: false = Local Mock, true = Real Backend
export const HIDE_PERSONAL_DEFAULT = false; // Toggle: Default privacy setting for new members

// ==========================================
// 2. API ENDPOINTS
// ==========================================
const API_BASE = "api/v1";

export const ENDPOINTS = {
  AUTH: `${API_BASE}/auth`,
  FAMILY_LIST: `${API_BASE}/family/list`,
  FAMILY_ADD: `${API_BASE}/family/add`,
  SEARCH: `${API_BASE}/search`,
};

export const IMPORT_TEMPLATES = {
  JSON: "/assets/import_templates/template.json",
  CSV: "/assets/import_templates/template.csv",
  XLSX: "/assets/import_templates/template.xlsx"
};

// ==========================================
// 3. DYNAMIC ASSET MANAGEMENT (IMAGES)
// ==========================================
// Automatically imports all PNGs from the assets folder.
// Note: 'eager: true' ensures they are bundled immediately, not lazily loaded.
const avatarModules = import.meta.glob('/src/assets/user/*.png', { eager: true });

// Export list of filenames for the UI dropdown
// export const PROFILE_IMAGES = Object.keys(avatarModules).map(path => path.split('/').pop());

export const PROFILE_IMAGES = [
  "image-profile.png", "default-profile.png", "vasu-dev.png", "rupesh.png", 
  "gokgoal.png", "sister1.png", "father1.png" ];

/**
 * Helper to get the resolved URL for an image.
 * Handles both development paths and production builds.
 * @param {string} filename - The filename (e.g., 'rupesh.png')
 * @returns {string} - The resolved path (e.g., '/assets/rupesh-hash.png')
 */
// export const getAvatarPath = (filename) => {
//   if (!filename) return '';
//   if (filename.startsWith('http')) return filename; // Handle external URLs (e.g. Google Auth)

//   const path = `/src/assets/user/${filename}`;
  
//   // Return resolved path if found, otherwise fallback to default
//   return avatarModules[path]?.default || avatarModules['/src/assets/user/default-profile.png']?.default || '';
// };
export const getAvatarPath = (filename) => {
  console.log(filename)
  if (!filename) return "/user/default-profile.png"; // Fallback
  
  // 1. Return if it's already a full URL (Google Auth, etc.)
  if (filename.startsWith('http') || filename.startsWith('blob:')) return filename;

  // 2. Return the static path from the public folder
  // Note: We add the base path '/family-tree' because of your vite config
  return `/user/${filename}`; 
};


export const DEFAULT_USER = {
  email: "default-klr-prodution@default-klr-produtionuser.com",
  token: "default-klr-prodution-token",
  pic: "default-profile.png" 
};

// ==========================================
// 4. ROLES & PERMISSIONS
// ==========================================
export const ROLES = {
  SUPER_ADMIN: 1,    
  COMMUNITY_HEAD: 2,
  FAMILY_HEAD: 3,
  TREASURER: 4,
  SECRETARY: 5,
  EDITOR: 6,
  MEMBER_VERIFIED: 7,
  MEMBER_PENDING: 8,
  GUEST: 9,
  BANNED: 10
};

// ==========================================
// 5. DEMOGRAPHICS & DROPDOWNS
// ==========================================

export const GENDER_TYPES = [
  "Male", "Female", "Non-Binary", "Transgender", "Other"
];

export const SEXUAL_ORIENTATIONS = [
  "Heterosexual", "Homosexual", "Bisexual", "Pansexual", "Asexual", "Queer", "Other"
];

export const RELATIONSHIP_TYPES = [
  "Father", "Mother", "Brother", "Sister", "Partner", "Spouse", 
  "Son", "Daughter", "Grandfather", "Grandmother", "Cousin", "Friend", 
  "Guardian", "Colleague", "Mentor", "Other"
];

export const CITIZENSHIPS = [
  "Indian", "American", "Chinese", "Russian", "British", "Canadian", 
  "Australian", "German", "French", "Japanese", "Brazilian", "South African",
  "Pakistani", "Bangladeshi", "Sri Lankan", "Nepali", "Mexican", "Italian",
  "Spanish", "South Korean", "Indonesian", "Nigerian", "Egyptian", "Other"
];

export const RACES = [
  "South Asian", "East Asian", "Asian", "African", "European", 
  "Native American", "Hispanic/Latino", "Middle Eastern", "Pacific Islander", 
  "Indigenous", "Mixed", "Other"
];

// ==========================================
// 6. GEOGRAPHIC DATA
// ==========================================
export const CITIES = [
  // Tier 1
  { name: "Mumbai", tier: 1 }, { name: "Delhi", tier: 1 }, { name: "Bangalore", tier: 1 },
  { name: "Hyderabad", tier: 1 }, { name: "Chennai", tier: 1 }, { name: "Kolkata", tier: 1 },
  // Tier 2
  { name: "Pune", tier: 2 }, { name: "Ahmedabad", tier: 2 }, { name: "Jaipur", tier: 2 },
  { name: "Surat", tier: 2 }, { name: "Lucknow", tier: 2 }, { name: "Kanpur", tier: 2 },
  { name: "Nagpur", tier: 2 }, { name: "Indore", tier: 2 }, { name: "Thane", tier: 2 },
  { name: "Bhopal", tier: 2 }, { name: "Visakhapatnam", tier: 2 }, { name: "Patna", tier: 2 },
  { name: "Vadodara", tier: 2 }, { name: "Ghaziabad", tier: 2 }, { name: "Ludhiana", tier: 2 },
  // Tier 3
  { name: "Agra", tier: 3 }, { name: "Nashik", tier: 3 }, { name: "Faridabad", tier: 3 },
  { name: "Meerut", tier: 3 }, { name: "Rajkot", tier: 3 }, { name: "Varanasi", tier: 3 },
  { name: "Srinagar", tier: 3 }, { name: "Aurangabad", tier: 3 }, { name: "Dhanbad", tier: 3 }
];