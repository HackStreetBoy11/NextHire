"use client";

import LoaderUI from "@/components/LoaderUI";
import { useUserRole } from "@/hooks/useUserRole";
// imports a custom hook that determines whether the current user is an interviewer or not
import { useRouter } from "next/navigation";
import InterviewScheduleUI from "./InterviewScheduleUI";

function SchedulePage() {
    const router = useRouter();

    const { isInterviewer, isLoading } = useUserRole();
    // isInterviewer : true if user has interviewer role
    // isLoading: true while fetching role info from database
    if (isLoading) return <LoaderUI />;
    if (!isInterviewer) return router.push("/");

    return <InterviewScheduleUI />;
}
export default SchedulePage;

// ⚙️ Summary
// SchedulePage protects the interview scheduling page:
// Shows loader while verifying role
// Redirects unauthorized users
// Renders scheduling dashboard for interviewers