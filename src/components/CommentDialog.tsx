import { useState } from "react";
import { Id } from "../../convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import toast from "react-hot-toast";
import { MessageSquareIcon, StarIcon } from "lucide-react";
/*
    useState: React hook to manage local state(open dialog, comment text,rating, etc)
    Id : type from convex auto-generated model -- ensures interviewId matches the "interviews" table type
    useMutation,useQuery: convex react  hooks to read/write data in the backend
    api: convex's auto-generated API object that gives you direct access to server functions
    toast: Library for showing user notifications
    MessageSquareIcon,StarIcon: Icons for UI (comments & rating)
*/
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { getInterviewerInfo } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { format } from "date-fns";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
/*
    various ui components (dialog,button,badge, scrollArea, etc) from your shadcn/ui setup
    getIterviewInfo: Helper function that fetches interviewer details(like name & images) by ID
    date-fns: Formats timestamps
    input components (select,Textarea) for rating & comment input
*/

function CommentDialog({ interviewId }: { interviewId: Id<"interviews"> }) {
    const [isOpen, setIsOpen] = useState(false);
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState("3");
    /*  
        Props: interviewId identifies which interview this comment belong to 
        State:
            - isOpen: Dialog visibility
            - comment: text of the user's comment
            - rating: selected rating(stored as string "1"-"5")
    */

    const addComment = useMutation(api.comments.addComment);
    const users = useQuery(api.users.getUsers);
    const existingComments = useQuery(api.comments.getComments, { interviewId });
    /*
        addComment: Calls the convex mutation to add a new comment
        users: Fetch all users (used to display interviewer details)
        existingComments: Fetch all comments for this specific interview
    */
    const handleSubmit = async () => {
        if (!comment.trim()) return toast.error("Please enter comment");

        try {
            await addComment({
                interviewId,
                content: comment.trim(),
                rating: parseInt(rating),
            });

            toast.success("Comment submitted");
            setComment("");
            setRating("3");
            setIsOpen(false);
        } catch (error) {
            toast.error("Failed to submit comment");
        }
    };
    /*
        This handles comment submission:
        1- checks if comment is not empty
        2- calls addcomment mutation with interviewId, content, and numeric rating
        3- on success -> shows toast, resets input fields, closes dialog
        4- on error -> shows failure toast
    */
    const renderStars = (rating: number) => (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((starValue) => (
                <StarIcon
                    key={starValue}
                    className={`h-4 w-4 ${starValue <= rating ? "fill-primary text-primary" : "text-muted-foreground"}`}
                />
            ))}
        </div>
    );
    //This dynamically creates 5 starts, filling them up based on the rating value - perfect for a quick visual respresentation of feedback

    if (existingComments === undefined || users === undefined) return null;
    // Avoid rendering before data loads -- prevents runtime errors.

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            {/* TRIGGER BUTTON */}
            <DialogTrigger asChild>
                <Button variant="secondary" className="w-full">
                    <MessageSquareIcon className="h-4 w-4 mr-2" />
                    Add Comment
                </Button>
            </DialogTrigger>
            {/* 
                Button that opens the dialog
                uses dialogTrigger with aschild to make the button the trigger element
            */}
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Interview Comment</DialogTitle>
                </DialogHeader>
                {/*  defines the dialog box width and title */}

                <div className="space-y-6">
                    {existingComments.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-medium">Previous Comments</h4>
                                <Badge variant="outline">
                                    {existingComments.length} Comment{existingComments.length !== 1 ? "s" : ""}
                                </Badge>
                            </div>

                            {/* DISPLAY EXISTING COMMENTS */}
                            <ScrollArea className="h-[240px]">
                                <div className="space-y-4">
                                    {existingComments.map((comment, index) => {
                                        const interviewer = getInterviewerInfo(users, comment.interviewerId);
                                        return (
                                            <div key={index} className="rounded-lg border p-4 space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarImage src={interviewer.image} />
                                                            <AvatarFallback>{interviewer.initials}</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="text-sm font-medium">{interviewer.name}</p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {format(comment._creationTime, "MMM d, yyyy • h:mm a")}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {renderStars(comment.rating)}
                                                </div>
                                                <p className="text-sm text-muted-foreground">{comment.content}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </ScrollArea>
                        </div>
                    )}
                    {/* 
                        This block only renders if there are previous comments
                        Inside:
                            - shows a header with total comment count in a badge
                            - Display a scrollable list of comments
                                - each comment shows
                                    - Interviewer's avatar (via getInerviewerInfo)
                                    -Name+formatted date/time
                                    - star rating visualization
                                    -comment content
                    */}

                    <div className="space-y-4">
                        {/* RATING */}
                        <div className="space-y-2">
                            <Label>Rating</Label>
                            <Select value={rating} onValueChange={setRating}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select rating" />
                                </SelectTrigger>
                                <SelectContent>
                                    {[1, 2, 3, 4, 5].map((value) => (
                                        <SelectItem key={value} value={value.toString()}>
                                            <div className="flex items-center gap-2">{renderStars(value)}</div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {/*  A dropdown selector for rating(1-5), each item shows its corresponding numer of stars. */}

                        {/* COMMENT */}
                        <div className="space-y-2">
                            <Label>Your Comment</Label>
                            <Textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Share your detailed comment about the candidate..."
                                className="h-32"
                            />
                        </div>
                        {/* A multi-line textarea for inputting detailed feedback */}
                    </div>
                </div>

                {/* BUTTONS */}
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit}>Submit</Button>
                </DialogFooter>
                {/* 
                    Cancel button closes dialog
                    submit button triggers handleSubmit
                */}
            </DialogContent>
        </Dialog>
    );
}
export default CommentDialog;