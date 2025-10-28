import { QuickActionType } from "@/constants";
import { Card } from "./ui/card";
/*
    QuickActionType:
        -- A typescript type/interface imported from  your constants file.
        -- it likely defines the structure of an action card object - for example.
            export type QuickActionType = {
            title: string;
            description: string;
            icon: React.ElementType;
            color: string;
            gradient: string;
            };
        -- so each "action" (like "start interview", "join Meeting","Review Past Sessions") has these properties.
    card:
        -- A UI wrapper component (likey from shadcn/ui or a custom design system)
        -- it provides styling, borders , and consistent layout for all cards.


*/
function ActionCard({ action, onClick }: { action: QuickActionType; onClick: () => void }) {
    /*
        This defines the functional component ActionCard.
        It accepts two props:
            1- action: The data object describing the action(title , icon , color, etc)
            2- onclick: Function  to run when the card is clicked -- probably navigates the user to another page
            (eg. /meeting /setup or /meeting/new)
    */
    return (
        <Card
            className="group relative overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg cursor-pointer"
            onClick={onClick}
        >
            {/* 
                Wraps the whole card in a <Card> Component
                ClassName:
                    group: enables group-hover effects for inner elements
                    relative: so child elements like gradients can use absolute positioning
                    over-flow-hidden:hides gradient or hover animations from overflowing
                    hover:border-primary/50: light border color change on hover
                    transition-all duration-300: smooth animations.
                    hover: shadow-lg: adds drop shadow for interactivity.
                    cursor-pointer: makes the card clickable
                onclick={onclick}: triggers the passed handler when clicked
            */}
            {/* ACTION GRADIENT */}
            <div
                className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-100 group-hover:opacity-50 transition-opacity`}
            />
            {/* 
            Creates a colorful gradient background overlay
            absolute inset-0: gradient from top-left -> bottom-right
            ${action.gradient}: dynamic gradient class passed from the action object
                - example: from-blue-500 to-purple-600
            opacity-100: fully visible by default
            group-hover:opacity-50-> fades slightly when hovered for contrast with text
            transation-opacityh->smooth fading animation
*/}
            {/* ACTION CONTENT WRAPPER */}
            <div className="relative p-6 size-full">
                <div className="space-y-3">

                    {/* 
                        relative: positions content above the absolute gradient
                        p-6: padding inside teh card
                        size-full : makes it fill the parent container
                        space-y-3 : vertical spacing between icon and text sections
                    */}

                    {/* ACTION ICON */}
                    <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center bg-${action.color}/10 group-hover:scale-110 transition-transform`}
                    >
                        <action.icon className={`h-6 w-6 text-${action.color}`} />
                    </div>
                    {/* 
                        A circular icon holder with a light background tint
                        bg-${action.color}/10: background with 10% apacity of the main color(e.g. bg-blue-500/10)
                        group-hover: scale -110 : slightly enlarges on hover
                        inside it:
                            -- <action.icon/>: dynamically renders a React icon component (e.g. VideoIcon, CodeIcon, etc)
                            -- text-${action.color}: icon color matches the theme color
                    🎨 This gives each card a visual identity (color-coded by purpose).
                    */}

                    {/* ACTION DETAILS */}
                    <div className="space-y-1">
                        <h3 className="font-semibold text-xl group-hover:text-primary transition-colors">
                            {action.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                    {/* 
                        Title: action.title
                         -- Bold and large, changes color to primary on hover
                        Description: action.description
                         -- small and muted -- gives additional context (e.g. "start a new interview session")
                        {
                            title: "Start Interview",
                            description: "Create a new live coding session",
                            icon: VideoIcon,
                            color: "blue-500",
                            gradient: "from-blue-400 to-indigo-500"
                        }

                    */}
                </div>
            </div>
        </Card>
    );
}

export default ActionCard;