import NextAuth from "next-auth";
import { authOptions } from "../src/app/api/auth/[...nextauth]/options";

// NextAuth handler signature is (req, res) or via NextRequest in App Router
// Let's mock a simple NextRequest or call NextAuth directly to see if it throws during options load
async function main() {
  console.log("Loading NextAuth options and calling NextAuth...");
  try {
    const handler = NextAuth(authOptions);
    console.log("NextAuth handler created successfully!");
    
    // Let's inspect the adapter database connection
    if (authOptions.adapter) {
      console.log("Checking adapter connection...");
      const adapter = authOptions.adapter;
      // Let's call getSessionAndUser or similar to test if database works through adapter
      console.log("Adapter keys:", Object.keys(adapter));
    }
  } catch (e) {
    console.error("Crash during NextAuth initialization:", e);
  }
}

main();
