"use client";
/*
  This make the component a client -side react component in Next.js 13+
  Necessary because you're using hoooks (useState, useQuery, useRouter) which connot run on the server
*/

import ActionCard from "@/components/ActionCard";
import { QUICK_ACTIONS } from "@/constants";
import { useUserRole } from "@/hooks/useUserRole";
import { useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import MeetingModal from "@/components/MeetingModal";
import LoaderUI from "@/components/LoaderUI";
import { Loader2Icon } from "lucide-react";
import MeetingCard from "@/components/MeetingCard";

/*
  ActionCard -> component for quick action button (e.g. "New Call")
  Quick_Action -> array of action items for the interviewer.
  useUserRole -> custom hook that returns {isInterviewer, isCandidate, isLoading}
  useQuery(api.interviews.getMyInterviews) -> fetches  interviews for the logged-in user from convex.
  useRouter -> Next.js router for navigation
  MeetingModal -> modal for starting/joinging meting
  LoaderUI/Loader2ICON -> loading spinners. (O in the center)
  MeetingCard -> displays individual interview info
*/ 

export default function Home() {
  const router = useRouter();
  const { isInterviewer, isCandidate, isLoading } = useUserRole();
  const interviews = useQuery(api.interviews.getMyInterviews);
  // USER ROLE AND INTERVIEWS
  /*  
    isLoading -> true while user role is begin fetched.
    isInterviewer/isCandidate -> used to conditionally render UI
    interviews -> array of interviews fetched from convex.
  */
  //  STATE MANAGEMENT
  const [showModal, setShowModal] = useState(false); // controls visibility of meetingModal
  const [modalType, setModalType] = useState<"start" | "join">();  // determine whether the modal is for "start" or "join" meeting

  const handleQuickAction = (title: string) => {
    switch (title) {
      case "New Call":
        setModalType("start");
        setShowModal(true);
        break;
      case "Join Interview":
        setModalType("join");
        setShowModal(true);
        break;
      default:
        router.push(`/${title.toLowerCase()}`);
    }
  };
  /*  
    Handles clicks on ActionCard Buttons:
      "New call" -> open modal to start a meeting
      "Join Interview" -> open modal to join a meeting
      default -> navigates to a page matching the aciton title
  */
  if (isLoading) return <LoaderUI />;
  /*  
    shows a loading spinner while the user role is being fetched
    ensures that ui does't render before auth/role is know
  */
  return (
    <div className="container max-w-7xl mx-auto p-6">
      {/* WELCOME SECTION */}
      <div className="rounded-lg bg-card p-6 border shadow-sm mb-10">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
          Welcome back!
        </h1>
        <p className="text-muted-foreground mt-2">
          {isInterviewer
            ? "Manage your interviews and review candidates effectively"
            : "Access your upcoming interviews and preparations"}
        </p>
      </div>
        {/* 
            Container with padding ,centered max width
            welcome sections shows personalized text based on the user role
            Uses Tailwind classes for styling : rounded-lg, bg-card, gradient text , etc
        */}
      {isInterviewer ? (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {QUICK_ACTIONS.map((action) => (
              <ActionCard
                key={action.title}
                action={action}
                onClick={() => handleQuickAction(action.title)}
              />
            ))}
          </div>

          <MeetingModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            title={modalType === "join" ? "Join Meeting" : "Start Meeting"}
            isJoinMeeting={modalType === "join"}
          />
        </>
        /*  
            Grid of actionCards for quick tasks.
            opens MeetingModal depending on modalType
            only visible if isInterviewer === true
        */
      ) : (
        <>
          <div>
            <h1 className="text-3xl font-bold">Your Interviews</h1>
            <p className="text-muted-foreground mt-1">View and join your scheduled interviews</p>
          </div>

          <div className="mt-8">
            {interviews === undefined ? (
              <div className="flex justify-center py-12">
                <Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : interviews.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {interviews.map((interview) => (
                  <MeetingCard key={interview._id} interview={interview} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                You have no scheduled interviews at the moment
              </div>
            )}
          </div>
        </>
        /*  
            Title + description for candidate
            conditional rendering based on interviews:
              undefined -> show loading spinner.
              length > 0 -> show grid of meeting cards.
              length === 0 show empty state message
        */
      )}
    </div>
  );
}

// 🔹 SUMMARY
// Client-side component for the home/dashboard page.
// Fetches user role (interviewer or candidate) via custom hook.
// Fetches user-specific interviews from Convex.
// Shows personalized welcome message based on role.
// Interviewer → can start/join calls via quick action cards + modal.
// Candidate → can see scheduled interviews with loading & empty states.
// Responsive UI using Tailwind grids.
// Clean UX with modals, spinners, and role-based rendering.