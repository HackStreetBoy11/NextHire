import { useUser } from "@clerk/nextjs";
// This import clerk's React hook that gives you the current authenticated user's details -- like their id,email,name,etc.
import { useQuery } from "convex/react";
// This imports the convex hook used to fetch data from your convex backend reactively.
// -- It automatically re-runs whenever data changes in the convex database.
import { api } from "../../convex/_generated/api";
// This imports typed Convex API function that were auto-generated after you defined backend funcions
// (like getUserByClerkId) in your convex/folder

export const useUserRole = () => {
    const { user } = useUser();
    // Gets the currently logged-in user's data from clerk.
    const userData = useQuery(api.users.getUserByClerkId, {
        clerkId: user?.id || "",
    });
    /*  
        This calls a convex backend function(getUserByClerkId) to fetch additional details (like role) of the user,
        If user is not loaded yet,it passes an empty string.
    */
    const isLoading = userData === undefined;
    /*
        In convex, while data is loading , the useQuery hook returns undefined.
        So this checks whether the data has finished loading.
    */

    return {
        isLoading,
        isInterviewer: userData?.role === "interviewer",
        isCandidate: userData?.role === "candidate",
    };
    // you now get a simple object to use anywhere in your app:
    //if (isLoading) return <Spinner />;
    // if (isInterviewer) return <InterviewDashboard />;
    // if (isCandidate) return <CandidateDashboard />;
};