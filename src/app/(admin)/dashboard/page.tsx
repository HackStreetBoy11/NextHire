/*
This page displays all interviews (grouped by category — upcoming, completed, failed, etc.), lets interviewers:
View candidates
See schedule (date/time)
Mark interviews as Passed/Failed
Add comments
It connects to Convex backend to fetch and update data in real-time.
*/


"use client";
// This makes the component a client-side react component (needed for hooks like useQuery,useMutation,etc)

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import toast from "react-hot-toast";
import LoaderUI from "@/components/LoaderUI";
import { getCandidateInfo, groupInterviews } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { INTERVIEW_CATEGORY } from "@/constants";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarIcon, CheckCircle2Icon, ClockIcon, XCircleIcon } from "lucide-react";
import { format } from "date-fns";
import CommentDialog from "@/components/CommentDialog";
/*
    useQuery, useMutation: convex hooks for fetching and updating database.
    api: Auto-generated convex API endpoints
    toast: For success/error purpose
    LoaderUi: A custom loader spinner component
    getCandidateInfo,groupInterviews: Utility functions (for formatting candidate data and categorizing interviews)
    Link, Button,Card,Badge,Avatar:Ui components from shadcn/ui and lucide icons.
    format from date-fns : For date formatting
*/

type Interview = Doc<"interviews">;

function DashboardPage() {
    const users = useQuery(api.users.getUsers);
    const interviews = useQuery(api.interviews.getAllInterviews);
    const updateStatus = useMutation(api.interviews.updateInterviewStatus);
    /*
        getUsers: fetches all users(to display candidate info)
        getAllInterviews: fetches all interviews from database
        UpdateInterviewStatus: Function to mark interview as passed , failed ,etc.

        All this is reactive -- if data changes on the backend, UI updates automatically.
    */

    const handleStatusUpdate = async (interviewId: Id<"interviews">, status: string) => {
        try {
            await updateStatus({ id: interviewId, status });
            toast.success(`Interview marked as ${status}`);
        } catch (error) {
            toast.error("Failed to update status");
        }
    };
    /*
        When "pass" or "fail" is clicked , this
        -- calls the convex mutation to update the interview's status
        -- display a toast message for success/failure
    */


    if (!interviews || !users) return <LoaderUI />;
    // if data isn't loaded yet,show a loading spinner

    const groupedInterviews = groupInterviews(interviews);
    /*
        This utility organizes interviews into categories like
        -- upcoming
        -- completed
        -- failed
        -- succeeded(based on INTERVIEW_CATEGORY constant)
    */

    return (
        <div className="container mx-auto py-10">
            <div className="flex items-center mb-8">
                <Link href="/schedule">
                    <Button>Schedule New Interview</Button>
                </Link>
            </div>
            {/* 
                Schedule New Interview Button
                --Navigates to /schedule where you can add a new interview.
            */}
            {/* 
                Loops through all categories and displays card if interviews exist in that category
                EACH INTERVIEW CARD
                    display
                    -- candidate's name and avatar(getCandidateInfo(users,interview.candidateId))
                    -- interview Title
                    -- date and time (format(startTime,"MM dd"), etc)
                    -- Buttons for Pass/fail (only visible if interview.status === "completed")
                    -- A comment dialog to add feedback
            */}
            <div className="space-y-8">
                {INTERVIEW_CATEGORY.map(
                    (category) =>
                        groupedInterviews[category.id]?.length > 0 && (
                            <section key={category.id}>
                                {/* CATEGORY TITLE */}
                                <div className="flex items-center gap-2 mb-4">
                                    <h2 className="text-xl font-semibold">{category.title}</h2>
                                    <Badge variant={category.variant}>{groupedInterviews[category.id].length}</Badge>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {groupedInterviews[category.id].map((interview: Interview) => {
                                        const candidateInfo = getCandidateInfo(users, interview.candidateId);
                                        const startTime = new Date(interview.startTime);

                                        return (
                                            <Card className="hover:shadow-md transition-all">
                                                {/* CANDIDATE INFO */}
                                                <CardHeader className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-10 w-10">
                                                            <AvatarImage src={candidateInfo.image} />
                                                            <AvatarFallback>{candidateInfo.initials}</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <CardTitle className="text-base">{candidateInfo.name}</CardTitle>
                                                            <p className="text-sm text-muted-foreground">{interview.title}</p>
                                                        </div>
                                                    </div>
                                                </CardHeader>

                                                {/* DATE &  TIME */}
                                                <CardContent className="p-4">
                                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                        <div className="flex items-center gap-1">
                                                            <CalendarIcon className="h-4 w-4" />
                                                            {format(startTime, "MMM dd")}
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <ClockIcon className="h-4 w-4" />
                                                            {format(startTime, "hh:mm a")}
                                                        </div>
                                                    </div>
                                                </CardContent>

                                                {/* PASS & FAIL BUTTONS */}
                                                <CardFooter className="p-4 pt-0 flex flex-col gap-3">
                                                    {interview.status === "completed" && (
                                                        <div className="flex gap-2 w-full">
                                                            <Button
                                                                className="flex-1"
                                                                onClick={() => handleStatusUpdate(interview._id, "succeeded")}
                                                            >
                                                                <CheckCircle2Icon className="h-4 w-4 mr-2" />
                                                                Pass
                                                            </Button>
                                                            <Button
                                                                variant="destructive"
                                                                className="flex-1"
                                                                onClick={() => handleStatusUpdate(interview._id, "failed")}
                                                            >
                                                                <XCircleIcon className="h-4 w-4 mr-2" />
                                                                Fail
                                                            </Button>
                                                        </div>
                                                    )}
                                                    <CommentDialog interviewId={interview._id} />
                                                </CardFooter>
                                            </Card>
                                        );
                                    })}
                                </div>
                            </section>
                        )
                )}
            </div>
        </div>
    );
}
export default DashboardPage;

// This dashboard:
// Fetches all interviews and users from Convex
// Groups interviews by status
// Lets interviewer:
// View candidate info
// See schedule
// Mark results
// Add comments
// It’s part of the interviewer role interface in your app.