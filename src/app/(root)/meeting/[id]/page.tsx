// 🧩 Purpose of This File
// This page:
// Loads a specific meeting (using the meeting ID in the URL)
// Checks if the user and call data are ready
// Shows a meeting setup screen first (for camera/mic checks)
// Then transitions to the actual meeting room (video call)
// It’s using Stream Video SDK (from @stream-io/video-react-sdk) for live video calls.

"use client";

import LoaderUI from "@/components/LoaderUI";
import MeetingRoom from "@/components/MeetingRoom";
import MeetingSetup from "@/components/MeetingSetup";
import useGetCallById from "@/hooks/useGetCallById";
import { useUser } from "@clerk/nextjs";
import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import { useParams } from "next/navigation";
import { useState } from "react";
/*
  LoaderUi: Custom loading spinner component.
  MeetingRoom: The main live meeting room component(video/audio call)
  MeetingSetUp: Pre-call setup (camera/mic test before joining).
  useGetCallById: A custom hook that fetches a specific all from stream by its ID.
  useUser(from Clerk ): check if the user is authenticated and loaded.
  streamCall, streamTheme: Components from stream SDK that wrap and theme the call.
  useParams: Next.js hook to read URL parameters(like /meeting/[id])
  useState: For managing setup completion.
*/


function MeetingPage() {
  const { id } = useParams();
  // This read the id part of the url (e.g. /meeting/12345 -> id ="12345")
  // that's the unique meeting ID used to fetch the call data.
  const { isLoaded } = useUser();
  // Check if the user data from clerk has finished loading 
  // isLoaded ensures you don't access user info before clerk finishes initializing
  const { call, isCallLoading } = useGetCallById(id);
  //  This custom hook features the meeting (call) info from stream API by the ID.

  const [isSetupComplete, setIsSetupComplete] = useState(false);
  // controls whether the user has completed camera / mic setup
  //initially false -> shows the meetingSetup screen.
  // when done->set to true-> shows MeetingRoom.
  if (!isLoaded || isCallLoading) return <LoaderUI />;
  // Displays a loader until: Clerk finishes loading user info , stream finishes fetching call details

  // if call isn't found
  if (!call) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-2xl font-semibold">Meeting not found</p>
      </div>
    );
  }

  return (
    <StreamCall call={call}>
      <StreamTheme>
        {!isSetupComplete ? (
          <MeetingSetup onSetupComplete={() => setIsSetupComplete(true)} />
        ) : (
          <MeetingRoom />
        )}
      </StreamTheme>
    </StreamCall>
  );
  /*
    <streamCall call = {call}>
    Provides the call context (camera , mic, participation, etc)
    <StremTheme>
        -- Applies default stream UI styling
    if setup not complete -> shows <MeetingSetup/>
    Once setUp is done -> shows <MeetingRoom/>
  */
}
export default MeetingPage;