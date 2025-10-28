import { clerkMiddleware } from '@clerk/nextjs/server';
/*
    This import a built-in fuction from clerk that helps you secure routes at the edge(before they reach your page ar API)
    Think of it as a security gate that runs before your Next.js app processes a request.
*/

export default clerkMiddleware();
// This activates clerk authentication on every route matched by your config(below)
// It ensures that clerk's session handling (JWT validation, redirects, etc.) runs properly before your page or API executes
export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};

/*  
    What does this do?
    -- The matcher tells Next.js which routes this middleware should run on.
    it skips:
    -- internal Next.js routes(_next)
    -- static assets like .jpg,.png,.css,.js,.svg etc
    But it runs on:
    -- Every Api routes(/api/*, /trpc/*)
    -- Every page route that isn't a static asset or internal Next.js path

    So clerk will automatically handle:
    -- Authentication for page
    -- Session validation for API calls
*/