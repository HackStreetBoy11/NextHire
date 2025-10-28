"use client";
/*
    this tells next.js that this file runs on the client side ,not the server.
    since it uses clerk(which works in the brower) and react context hooks (useAuth), it must be a client component
*/

import { ClerkProvider, useAuth } from "@clerk/nextjs";
// clerkProvider : wraps your app and gives all pages access to clerk's authenitcation context - who's logged in , sign in/out, etc
// useAuth : A clerk hook that provides funciton like getToken(), userId, isSignedIn, etc
import { ConvexReactClient } from "convex/react";
// This creates a convex client to connect to your convex backend.
// it's like axios but specifically made for convex
// you'll call useQuery , useMutation, etc. through it to interact with your database funcitons.
import { ConvexProviderWithClerk } from "convex/react-clerk";
// this is a  special convex provider that intergrates directly with clerk.
//  it automatically attaches your clerk auth token to convex requests.
// that way,convex knows which user is making the request == securely

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
//here you create the convex client instance, passing your convex project's public url from .env.local
// the ! just tell typescript: "trust me , this environment variable exists",

function ConvexClerkProvider({ children }: { children: React.ReactNode }) {
    return (
        <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
            <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
                {children}
            </ConvexProviderWithClerk>
        </ClerkProvider>
    );
}
/*  
    clerkProvider wraps everthings to enable authentication features across your app.
    -- it uses the clerk publishable key(public key) to initialize the clerk SDK    

    convexProviderWithClerk then connects convex with clerk's auth system
    -- it uses useAuth to get the logged-in user's token
    -- it ensures all useQuery/useMutation calls automatically include your token so convex can identify who's calling

    {children}-> means anything inside your layout (all app pages) will have access to both clerk + convex contexts
*/
export default ConvexClerkProvider;


// ChatGPT said:
// Excellent — this is the right kind of deep question 👏
// Let’s break it into two parts — (1) which token is being used, and (2) what happens in the layout.tsx file.
// 🧩 1️⃣ Which Token Are We Taking Here
// In this line 👇
// <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
// we are passing the useAuth hook from Clerk.
// That hook internally provides a JWT (JSON Web Token) — the Clerk session token of the currently signed-in user.
// 🔐 What happens behind the scenes
// When a user signs in with Clerk:
// Clerk stores an access token (JWT) in memory or local storage (depending on mode).
// That token represents the user's session (it includes userId, expiry, etc.).
// When Convex makes an API call to your Convex backend, ConvexProviderWithClerk automatically:
// Calls useAuth().getToken()
// Retrieves the user’s Clerk token
// Sends it in the request headers to Convex
// Convex verifies it with Clerk’s public key to confirm the user is authentic.
// 💬 So which token is this?
// It’s the Clerk session JWT token — specifically used to authorize requests from the frontend (browser) → Convex backend.
// You don’t manually see or set this token anywhere; it’s managed automatically by the SDK.
// 🧠 Bonus: You can manually access it if needed:
// const { getToken } = useAuth();
// const token = await getToken();
// console.log(token);


// But usually you don’t need to — ConvexProviderWithClerk handles it for you.
// 🏗️ 2️⃣ What Happens in layout.tsx
// The layout.tsx (usually inside app/) is the root layout for your Next.js app.
// You likely have something like this:
// import ConvexClerkProvider from "@/providers/ConvexClerkProvider";
// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body>
//         <ConvexClerkProvider>
//           {children}
//         </ConvexClerkProvider>
//       </body>
//     </html>
//   );
// }
// 📜 What it does:
// The <html> and <body> tags define the overall browser-rendered structure.
// Next.js renders this once in the browser.
// Inside <ConvexClerkProvider>...</ConvexClerkProvider> all your pages (Home, Dashboard, etc.) get:
// Access to Clerk authentication (user info, sign in/out)
// Access to Convex backend (queries, mutations)
// So yes ✅ — all the actual HTML seen by the browser (your entire UI tree) gets rendered inside this layout.
// That’s why your layout is the “root shell” that holds:
// Global providers (like this one)
// Navbar, footer, or theme wrappers