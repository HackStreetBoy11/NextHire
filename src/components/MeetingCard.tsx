import useMeetingActions from "@/hooks/useMeetingActions";
import { Doc } from "../../convex/_generated/dataModel";
import { getMeetingStatus } from "@/lib/utils";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { CalendarIcon } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
/*
    useMeetingAction: custom hook that gives the joinMeeting function
    Doc: defines the type for interview data from Convex DB
    getMeetingStatus: helper function that tells if the meeting is live , upcomming,or completed
    Ui imports like Card,Button, Badge, CalendarIcon,etc are from shadcn/ui and lucide-react
    format from date-fns formats the date nicely
*/

type Interview = Doc<"interviews">;
//  defines Interview type from convex interview table

function MeetingCard({ interview }: { interview: Interview }) {
    // react componeent taking one prop interview
    const { joinMeeting } = useMeetingActions();
    //  Extracts joinMeeting function from custom hook
    const status = getMeetingStatus(interview);
    // gets current meeting status (live/upcoming/completed).
    const formattedDate = format(new Date(interview.startTime), "EEEE, MMMM d · h:mm a");
    //  formats interview start time into readable text
    return (
        <Card>
            {/* returns ui card layout */}
            <CardHeader className="space-y-2">
                {/*
                    header section of the card with spacing
                 */}
                <div className="flex items-center justify-between">
                    {/* flexbox container for date & badge */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarIcon className="h-4 w-4" />
                        {formattedDate}
                        {/* shows calendar icon and formatted date */}
                    </div>

                    <Badge
                    // displays badge based on status
                        variant={
                            status === "live" ? "default" : status === "upcoming" ? "secondary" : "outline"
                        }
                    >
                        {status === "live" ? "Live Now" : status === "upcoming" ? "Upcoming" : "Completed"}
                    </Badge>
                </div>

                <CardTitle>{interview.title}</CardTitle>
                        {/*  displays interview title */}
                {interview.description && (
                    <CardDescription className="line-clamp-2">{interview.description}</CardDescription>
                )}
                {/* 
                    if description exists, shows it (limited to 2lines)
                */}
            </CardHeader>

            <CardContent>
                {status === "live" && (
                    <Button className="w-full" onClick={() => joinMeeting(interview.streamCallId)}>
                        Join Meeting
                    </Button>
                )}
                {/*  if meeting is live -> shows "join meeting"button */}
                {status === "upcoming" && (
                    <Button variant="outline" className="w-full" disabled>
                        Waiting to Start
                    </Button>
                )}
                {/*  if meeting upcoming-> show disabled "waaiting to start" button */}
            </CardContent>
            {/* 
                Main content area(buttons)
            */}
        </Card>
    );
}
export default MeetingCard;