import {
    CallControls,
    CallingState,
    CallParticipantsList,
    PaginatedGridLayout,
    SpeakerLayout,
    useCallStateHooks,
} from "@stream-io/video-react-sdk";
// imports video SDK components for call UI and state handling
import { LayoutListIcon, LoaderIcon, UsersIcon } from "lucide-react";
// icons for layout, loading, and participants
import { useRouter } from "next/navigation";
import { useState } from "react";
//  Hooks for navigation and local state
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./ui/resizable";
// components for a split resizable screen layout
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
// UI components for menu and buttons
import EndCallButton from "./EndCallButton";
import CodeEditor from "./CodeEditor";
//  custom components one to end call , one as an in-call code editor
function MeetingRoom() {
    const router = useRouter();
    // enables navigation (used for redirect after leaving call)
    const [layout, setLayout] = useState<"grid" | "speaker">("speaker");
    // stores current video layout mode(grid/speaker)
    const [showParticipants, setShowParticipants] = useState(false);
    // controls visibility of participants panel
    const { useCallCallingState } = useCallStateHooks();
    const callingState = useCallCallingState();
    //  Accesses and monitors current call status(connecting/joined/etc.)
    if (callingState !== CallingState.JOINED) {
        return (
            <div className="h-96 flex items-center justify-center">
                <LoaderIcon className="size-6 animate-spin" />
            </div>
        );
    }
    // shows a loading spinner until the user fully joins call
    return (
        <div className="h-[calc(100vh-4rem-1px)]">
            {/*  full viewport height (minus navbar) */}
            <ResizablePanelGroup direction="horizontal">
                {/* Horizontal split layout (video+editor) */}
                <ResizablePanel defaultSize={35} minSize={25} maxSize={100} className="relative">
                    {/* left section(video area)-- takes 35% width by default */}
                    {/* VIDEO LAYOUT */}
                    <div className="absolute inset-0">
                        {layout === "grid" ? <PaginatedGridLayout /> : <SpeakerLayout />}
                        {/* switch between grid or speaker video layout */}
                        {/* PARTICIPANTS LIST OVERLAY */}
                        {showParticipants && (
                            <div className="absolute right-0 top-0 h-full w-[300px] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                                <CallParticipantsList onClose={() => setShowParticipants(false)} />
                            </div>
                        )}
                        {/* overlay showing participants list (toggleable) */}
                    </div>

                    {/* VIDEO CONTROLS */}

                    <div className="absolute bottom-4 left-0 right-0">
                        <div className="flex flex-col items-center gap-4">
                            <div className="flex items-center gap-2 flex-wrap justify-center px-4">
                                <CallControls onLeave={() => router.push("/")} />
                                {/*  standard video controls(mic,camera,leave,etc) 
                                    redirects to home after leaving call
                                */}
                                <div className="flex items-center gap-2">
                                    <DropdownMenu>
                                        {/*  allows user to switch between grid and speaker view */}
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" size="icon" className="size-10">
                                                <LayoutListIcon className="size-4" />
                                            </Button>
                                            {/* button to show/hide participants list */}
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem onClick={() => setLayout("grid")}>
                                                Grid View
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setLayout("speaker")}>
                                                Speaker View
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>

                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="size-10"
                                        onClick={() => setShowParticipants(!showParticipants)}
                                    >
                                        <UsersIcon className="size-4" />
                                    </Button>

                                    <EndCallButton />
                                    {/* Ends the call for everyone */}
                                </div>
                            </div>
                        </div>
                    </div>
                </ResizablePanel>

                <ResizableHandle withHandle />

                <ResizablePanel defaultSize={65} minSize={25}>
                    <CodeEditor />
                </ResizablePanel>
                {/* 
                    Right section(code editor) -- occupies 65% width
                */}
            </ResizablePanelGroup>
        </div>
    );
}
export default MeetingRoom;