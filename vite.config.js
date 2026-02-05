import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 1. Load env variables (including those from GitHub Actions)
  // The third argument '' allows loading variables that don't start with VITE_
  /*"default-profile.png" "vasu-dev.png" "rupesh.png" "gokgoal.png"
"sister1.png" "sister2.png" "sister3.png" "sisterelder.png" "sisteryounger.png"
"brother1.png" "brother2.png" "brother3.png" "brotherelder.png" "brotheryounger.png"
"father1.png" "father2.png" "father3.png" "father4.png"
"mother1.png" "mother2.png" "mother3.png" "mother4.png"
"father-sister1.png" "father-sister2.png" "father-sister3.png"
"father-brother1.png" "father-brother2.png" "father-brother3.png"
"cousinsister1.png" "cousinsister2.png" "cousinsister3.png" "cousinsisterelder.png" "cousinsisteryounger.png"
"cousinbrother1.png" "cousinbrother2.png" "cousinbrother3.png" "cousinbrotherelder.png" "cousinbrotheryounger.png"
"father-cousinsister1.png" "father-cousinsister2.png" "father-cousinsister3.png"
"father-cousinsisterelder.png" "father-cousinsisteryounger.png"
"father-cousinbrother1.png" "father-cousinbrother2.png" "father-cousinbrother3.png"
"father-cousinbrotherelder.png" "father-cousinbrotheryounger.png"
"mother-cousin-sister1.png" "mother-cousin-sister2.png" "mother-cousin-sister3.png"
"mother-cousin-sisterelder.png" "mother-cousin-sisteryounger.png"
"mother-cousin-brother1.png" "mother-cousin-brother2.png" "mother-cousin-brother3.png"
"mother-cousin-brotherelder.png" "mother-cousin-brotheryounger.png"
"grandfather-paternal.png" "grandmother-paternal.png"
"grandfather-maternal.png" "grandmother-maternal.png"
"uncle-sharma.png" "uncle-verma.png" "aunty-sharma.png" "aunty-verma.png"
"nephew-1.png" "niece-1.png"*/ 
  const env = loadEnv(mode, process.cwd(), '')

  // 2. Check the variable
  const isGitHub = env.isLiveInGitHUB === 'true';

  // 3. Return the config object
  return {
    plugins: [react()],
    base: isGitHub ? "/family-tree/" : "/",
  }
})