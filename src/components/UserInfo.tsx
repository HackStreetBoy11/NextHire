import { UserCircleIcon } from "lucide-react";
import { Doc } from "../../convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type User = Doc<"users">;

function UserInfo({ user }: { user: User }) {
    return (
        <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
                <AvatarImage src={user.image} />
                <AvatarFallback>
                    <UserCircleIcon className="h-4 w-4" />
                </AvatarFallback>
            </Avatar>
            <span>{user.name}</span>
        </div>
    );
}
export default UserInfo;

// This UserInfo component displays a user’s avatar and name in a small flex layout.
// It uses Shadcn UI’s Avatar to show the user’s profile image (user.image).
// If no image is available, it shows a fallback icon (UserCircleIcon).
// Finally, it displays the user’s name (user.name) beside the avatar.