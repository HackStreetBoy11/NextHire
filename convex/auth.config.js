export default {
    providers: [
        {
            domain: "https://wired-dory-43.clerk.accounts.dev",
            applicationID: "convex",
        },
    ],
};
// 🧩 Step 1️⃣ — Where the access token is attached
// When your frontend calls a Convex function like this:
// const data = useQuery(api.interviews.getMyInterviews);


// You’re not manually sending any token — it looks so simple.
// But under the hood, here’s what happens automatically:
// You’ve wrapped your entire app with:
// <ConvexProviderWithClerk client={convex} useAuth={useAuth}>

// Inside ConvexProviderWithClerk, Convex calls:
// const token = await useAuth().getToken({ template: "convex" });
// That getToken() function comes from Clerk and returns the current access token (JWT).
// Convex then attaches that token to every HTTP request header like this:
// Authorization: Bearer <ACCESS_TOKEN>

// So every time your frontend calls a Convex query/mutation, it includes that JWT in the HTTP header.
// ✅ You never see this happen in your code — it’s handled automatically.
// 🔍 Step 2️⃣ — Where the token is verified
// Now we move to the backend side (Convex).
// When Convex receives a request with:
// Authorization: Bearer <ACCESS_TOKEN>

// It uses its Auth configuration (in your project usually stored in convex/auth.config.ts) to verify it.
// Here’s what typically happens there 👇
// import { auth } from "@clerk/nextjs/server";

// export const authConfig = {
//   getUserIdentity: async (ctx) => {
//     const token = ctx.request.headers.get("Authorization")?.split(" ")[1];
//     if (!token) return null;

//     // Convex verifies the token using Clerk’s public keys automatically
//     const identity = await auth.verifyToken(token);
//     return identity;
//   },
// };

// 👉 In reality, Convex already knows how to verify Clerk tokens, so you often don’t even have to write that yourself.
// Convex uses Clerk’s public JWK keys (JSON Web Keys) to validate the signature of the access token.
// This ensures:
// The token was issued by Clerk.
// It hasn’t expired.
// It matches a real user.
// If all that checks out ✅, Convex gives your backend function access to that user’s identity via:
// const identity = await ctx.auth.getUserIdentity();
// 🧠 Step 3️⃣ — Validation happens before your code runs
// Convex automatically checks the token before executing your query or mutation.
// If the access token is invalid or expired:
// The request fails immediately with a 401 Unauthorized.
// Clerk silently refreshes the token in the browser and retries the request.
// You never have to handle this manually. 💪
// User signs in (Clerk)
//      ↓
// Clerk stores access + refresh tokens
//      ↓
// useAuth() gives access token to Convex
//      ↓
// Convex sends request:
//   Authorization: Bearer <access_token>
//      ↓
// Convex backend verifies token with Clerk public keys
//      ↓
// If valid → runs your Convex query/mutation
//      ↓
// Inside your Convex code: ctx.auth.getUserIdentity() returns Clerk user info
