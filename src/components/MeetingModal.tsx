import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import useMeetingActions from "@/hooks/useMeetingActions";
// imports custom hook that handles meeting actions
interface MeetingModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    isJoinMeeting: boolean;
}
//  defines the props for the modal (open state, close handler,etc.)
function MeetingModal({ isOpen, onClose, title, isJoinMeeting }: MeetingModalProps) {
    // functional component accepting props defined above
    const [meetingUrl, setMeetingUrl] = useState("");
    // local state to store meeting URL input by user
    const { createInstantMeeting, joinMeeting } = useMeetingActions();
    // extracts two functions: one to start , one to join meeting
    const handleStart = () => {
        //  called when user click " join" or " start" button
        if (isJoinMeeting) {
            // if it's a full URL extract meeting ID
            const meetingId = meetingUrl.split("/").pop();
            if (meetingId) joinMeeting(meetingId);
        } else {
            createInstantMeeting();
        }
        // if joining -> extract meeting ID from URL and join
        // if starting -> create new instant meeting
        setMeetingUrl("");
        onClose();
        //  reset input and close modal after action
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            {/* renders dialog modal:visibility controlled by isOpen */}
            <DialogContent className="sm:max-w-[425px]">
                {/* Modal content with max width of 425px */}
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                {/* displays modal header and title */}
                <div className="space-y-4 pt-4">
                    {isJoinMeeting && (
                        <Input
                            placeholder="Paste meeting link here..."
                            value={meetingUrl}
                            onChange={(e) => setMeetingUrl(e.target.value)}
                        />
                    )}
                    {/* show input box only if user is joining (not hosting) */}
                    <div className="flex justify-end gap-3">
                        {/* container for buttons aligned to the right */}
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        {/* cancel button closes the modal */}
                        <Button onClick={handleStart} disabled={isJoinMeeting && !meetingUrl.trim()}>
                            {isJoinMeeting ? "Join Meeting" : "Start Meeting"}
                        </Button>
                        {/* "join" or "start" button , disabled if joining without URL */}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
export default MeetingModal;