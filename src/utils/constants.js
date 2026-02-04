// CONFIGURATION
export const IS_BACKEND_HOSTED = false; // Toggle this to switch between Mock/Real
export const HIDE_PERSONAL_DEFAULT = false; // False for dev, True for prod

// API ENDPOINTS (Versioning)
const API_BASE = "api/v1";
export const ENDPOINTS = {
  AUTH: `${API_BASE}/auth`,
  FAMILY_LIST: `${API_BASE}/family/list`,
  FAMILY_ADD: `${API_BASE}/family/add`,
  SEARCH: `${API_BASE}/search`,
};

// ASSETS: Profile Images List
export const PROFILE_IMAGES = [
  "image-profile.png", "default-profile.png", "vasu-dev.png", "rupesh.png", "gokgoal.png",
  "sister1.png", "sister2.png", "sister3.png", "sisterelder.png", "sisteryounger.png",
  "brother1.png", "brother2.png", "brother3.png", "brotherelder.png", "brotheryounger.png",
  "father1.png", "father2.png", "father3.png", "father4.png",
  "mother1.png", "mother2.png", "mother3.png", "mother4.png",
  "father-sister1.png", "father-sister2.png", "father-sister3.png",
  "father-brother1.png", "father-brother2.png", "father-brother3.png",
  "cousinsister1.png", "cousinsister2.png", "cousinsister3.png", "cousinsisterelder.png", "cousinsisteryounger.png",
  "cousinbrother1.png", "cousinbrother2.png", "cousinbrother3.png", "cousinbrotherelder.png", "cousinbrotheryounger.png",
  "father-cousinsister1.png", "father-cousinsister2.png", "father-cousinsister3.png", "father-cousinsisterelder.png", "father-cousinsisteryounger.png",
  "father-cousinbrother1.png", "father-cousinbrother2.png", "father-cousinbrother3.png", "father-cousinbrotherelder.png", "father-cousinbrotheryounger.png",
  "mother-cousin-sister1.png", "mother-cousin-sister2.png", "mother-cousin-sister3.png", "mother-cousin-sisterelder.png", "mother-cousin-sisteryounger.png",
  "mother-cousin-brother1.png", "mother-cousin-brother2.png", "mother-cousin-brother3.png", "mother-cousin-brotherelder.png", "mother-cousin-brotheryounger.png"
];

// DATA: Indian Cities (Tier 1, 2, 3)
export const CITIES = [
  { name: "Mumbai", tier: 1 }, { name: "Delhi", tier: 1 }, { name: "Bangalore", tier: 1 },
  { name: "Hyderabad", tier: 1 }, { name: "Chennai", tier: 1 }, { name: "Kolkata", tier: 1 },
  { name: "Pune", tier: 2 }, { name: "Ahmedabad", tier: 2 }, { name: "Jaipur", tier: 2 },
  { name: "Surat", tier: 2 }, { name: "Lucknow", tier: 2 }, { name: "Kanpur", tier: 2 },
  { name: "Nagpur", tier: 2 }, { name: "Indore", tier: 2 }, { name: "Thane", tier: 2 },
  { name: "Bhopal", tier: 2 }, { name: "Visakhapatnam", tier: 2 }, { name: "Patna", tier: 2 },
  { name: "Vadodara", tier: 2 }, { name: "Ghaziabad", tier: 2 }, { name: "Ludhiana", tier: 2 },
  { name: "Agra", tier: 3 }, { name: "Nashik", tier: 3 }, { name: "Faridabad", tier: 3 },
  { name: "Meerut", tier: 3 }, { name: "Rajkot", tier: 3 }, { name: "Varanasi", tier: 3 },
  { name: "Srinagar", tier: 3 }, { name: "Aurangabad", tier: 3 }, { name: "Dhanbad", tier: 3 }
];
export const ROLES = {
  SUPER_ADMIN: 1,    // The one you requested
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

export const DEFAULT_USER = {
  email: "default-klr-prodution@default-klr-produtionuser.com",
  token: "default-klr-prodution-token",
  pic: "user/image-profile.png" // Ensure this exists in public/user/ folder
};