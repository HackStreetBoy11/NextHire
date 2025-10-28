import { CallRecording } from "@stream-io/video-react-sdk";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { calculateRecordingDuration } from "@/lib/utils";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { CalendarIcon, ClockIcon, CopyIcon, PlayIcon } from "lucide-react";
import { Button } from "./ui/button";
/*
    CallRecording ->type definition from stream Video SDK (represents a single call recording object)
    format->from date-fns library
    calculateRecordingDuration->custom fucntion that calculates hwo long the recording lasted (probably return something like 
    "10 min")
    card components -> from your custom ui library 
    lucide icons -> vector icons (calendar ,clock ,copy, play) for better ui
    button -> your reusable button component
*/


function RecordingCard({ recording }: { recording: CallRecording }) {
    // defines a react function component, it takes a single prop recording , which is typed as a callRecodring object
    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(recording.url);
            toast.success("Recording link copied to clipboard");
        } catch (error) {
            toast.error("Failed to copy link to clipboard");
        }
    };
    // when ther user click the copy button , thsi funciton runs
    // uses navigator.clipboard.writeText() to copy the recording's url to clipboard
    // shows a success toast on success, or an error taost if it fails
    const formattedStartTime = recording.start_time
        ? format(new Date(recording.start_time), "MMM d, yyyy, hh:mm a")
        : "Unknown";
    // converts the recording's start time into a human-redable format like "oct 28 2025, 06:30 PM"
    // if no start time exists,displays "unknown"
    const duration =
        recording.start_time && recording.end_time
            ? calculateRecordingDuration(recording.start_time, recording.end_time)
            : "Unknown duration";
    // If both start and end time exist, calculates how long the recording lasted
    //otherwise,shows "Unknown duration"
    return (
        <Card className="group hover:shadow-md transition-all">
            {/* 
                Wraps everything inside a Card component.
                The group class allows child elements to react to hover states of the parent.
                Adds subtle shadow on hover.
                */}
            {/* CARD HEADER */}
            <CardHeader className="space-y-1">
                <div className="space-y-2">
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center text-sm text-muted-foreground gap-2">
                            <CalendarIcon className="h-3.5 w-3.5" />
                            <span>{formattedStartTime}</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground gap-2">
                            <ClockIcon className="h-3.5 w-3.5" />
                            <span>{duration}</span>
                        </div>
                    </div>
                </div>
            </CardHeader>
            {/* 
                Displays the recording date (with calendar icon) and duration (with clock icon).
                text-muted-foreground → gives a lighter color to the text.
                gap-* → spacing between icon and text.
            */}
            {/* CARD CONTENT */}

            <CardContent>
                <div
                    className="w-full aspect-video bg-muted/50 rounded-lg flex items-center justify-center cursor-pointer group"
                    onClick={() => window.open(recording.url, "_blank")}
                >
                    <div className="size-12 rounded-full bg-background/90 flex items-center justify-center group-hover:bg-primary transition-colors">
                        <PlayIcon className="size-6 text-muted-foreground group-hover:text-primary-foreground transition-colors" />
                    </div>
                </div>
            </CardContent>
            {/* 
                Shows a video-like preview box (16:9 aspect ratio).
                Clicking it opens the recording in a new tab (window.open(recording.url, "_blank")).
                The play icon animates color on hover using group-hover.
            */}
            <CardFooter className="gap-2">
                <Button className="flex-1" onClick={() => window.open(recording.url, "_blank")}>
                    <PlayIcon className="size-4 mr-2" />
                    Play Recording
                </Button>
                <Button variant="secondary" onClick={handleCopyLink}>
                    <CopyIcon className="size-4" />
                </Button>
            </CardFooter>
            {/* 
                First button → “Play Recording” opens the recording video link in a new tab.
                Second button → “Copy link” button triggers handleCopyLink() to copy URL to clipboard.
                flex-1 → lets the Play button take maximum available width.
                variant="secondary" → styles the copy button differently (like a gray tone).
            */}
        </Card>
    );
}
export default RecordingCard;