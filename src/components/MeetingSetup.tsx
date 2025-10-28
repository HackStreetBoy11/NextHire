import { DeviceSettings, useCall, VideoPreview } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { CameraIcon, MicIcon, SettingsIcon } from "lucide-react";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";

/*
    @stream-io/video-reacd-sdk -> stream's React SDK for video/audio calls
        -- useCall -> gives access to the current video call instance
        -- videoPreview -> shows local camera preview before joining the call
        -- DeviceSettings -> ui for selecting audio/video devices
    useEffect,useState -> React hooks for state management and side effects
    card, switch,button-> custom ui components (probably from shadCN/ui)
    icons from lucide-react -> used for camera , mic  and settings visuals.
*/

function MeetingSetup({ onSetupComplete }: { onSetupComplete: () => void }) {
    /*  
        This defines a  react component named MeetingSetup
        it takes one prop:
        -- onSetupComplete -> a callback function triggered when the user click " join Meeting "(to move to the next step , e.g. entering the live room)
    */
    const [isCameraDisabled, setIsCameraDisabled] = useState(true);
    const [isMicDisabled, setIsMicDisabled] = useState(false);
    /*  
        Two local state variable to manage camera and mic status
         -- camera is initially diabled (true)
         -- mic is initially enabled (false)
        These state control both the switch ui and the actual call hardware via stream sdk
    */

    const call = useCall();
    if (!call) return null;
    /*
        useCall(() gets the current active call context (created by stream)
        if call is not available (e.g. not yet initialize) return null - this prevents rendering errors before
        the SDK loads
    */

    useEffect(() => {
        if (!call) return;
        if (isCameraDisabled) call.camera.disable();
        else call.camera.enable();
    }, [isCameraDisabled, call]);
    /*
        This hook runs whenever isCameraDisabled or call changes.
        if isCameraDisabled -> turn off camera.
        Else ->enable camera
        Uses Stream SDK's  call.camera API to control the local video stream,
    */

    useEffect(() => {
        if (!call) return;
        if (isMicDisabled) call.microphone.disable();
        else call.microphone.enable();
    }, [isMicDisabled, call]);

    /*
        Similar to camera control, but for microphone
        Reactively toggles the mic whenever isMicDisabled changes
    */

    const handleJoin = async () => {
        await call.join();
        onSetupComplete();
    };
    /*
        when user clicks "join meeting"
        -- calls call.join() -> connects user to the meeting room
        -- then executes onSetupComplete() -> signals parent component that setup is done (you'll likely
        route to the main meeting screen here)
    */

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-background/95">
        {/*
            Full-screen ,Centered container
            uses tailwind css for layout and styling
            slightly transparent background (bg-background/95)
         */}
            <div className="w-full max-w-[1200px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 
                        Centers everything
                        Uses a 2-column grid layout
                            - left: video preview
                            - RightL meeting details+controls
                    */}
                    {/* VIDEO PREVIEW CONTAINER */}
                    <Card className="md:col-span-1 p-6 flex flex-col">
                        <div>
                            <h1 className="text-xl font-semibold mb-1">Camera Preview</h1>
                            <p className="text-sm text-muted-foreground">Make sure you look good!</p>
                        </div>
                        {/* Displays a title and description */}
                        {/* VIDEO PREVIEW */}
                        <div className="mt-4 flex-1 min-h-[400px] rounded-xl overflow-hidden bg-muted/50 border relative">
                            <div className="absolute inset-0">
                                <VideoPreview className="h-full w-full" />
                            </div>
                        </div>
                        {/* 
                        Container for live camera preview
                        videoPreview from stream SDK renders a video feed of your local camera
                         */}
                    </Card>
                    {/* CARD CONTROLS */}
                    <Card className="md:col-span-1 p-6">
                        <div className="h-full flex flex-col">
                            {/*
                                Right side of the screen showing meeting details and toogles 
                             */}
                            {/* MEETING DETAILS  */}
                            <div>
                                <h2 className="text-xl font-semibold mb-1">Meeting Details</h2>
                                <p className="text-sm text-muted-foreground break-all">{call.id}</p>
                            </div>
                            {/*
                                Displays the meeting ID (from stream call object)
                                break-all ensures long id's wrap properly 
                             */}

                            <div className="flex-1 flex flex-col justify-between">
                                <div className="spacey-6 mt-8">
                                    {/* CAM CONTROL */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                <CameraIcon className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium">Camera</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {isCameraDisabled ? "Off" : "On"}
                                                </p>
                                            </div>
                                        </div>
                                        <Switch
                                            checked={!isCameraDisabled}
                                            onCheckedChange={(checked) => setIsCameraDisabled(!checked)}
                                        />
                                    </div>
                                    {/*
                                    A toggle switch for the camera
                                    controlled by isCameraDisabled state
                                    when user toggles it -> updates state, which triggers the useEffect hook to enable/disable camera. 
                                     */}
                                    {/* MIC CONTROL */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                <MicIcon className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium">Microphone</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {isMicDisabled ? "Off" : "On"}
                                                </p>
                                            </div>
                                        </div>
                                        <Switch
                                            checked={!isMicDisabled}
                                            onCheckedChange={(checked) => setIsMicDisabled(!checked)}
                                        />
                                        {/* 
                                            Same logic as the camera switch but controls the microphone
                                         */}
                                    </div>

                                    {/* DEVICE SETTINGS */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                <SettingsIcon className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium">Settings</p>
                                                <p className="text-sm text-muted-foreground">Configure devices</p>
                                            </div>
                                        </div>
                                        <DeviceSettings />
                                        {/*
                                        Built-in stream ui for changing camera/mic/spearker input devices
                                        automatically opens a dialog or ui for device selection 
                                         */}
                                    </div>
                                </div>

                                {/* JOIN BTN */}
                                <div className="space-y-3 mt-8">
                                    <Button className="w-full" size="lg" onClick={handleJoin}>
                                        Join Meeting
                                    </Button>
                                    {/*
                                        calls handleJoin() when clicked
                                        connects user to the meeting and triggers onSetUpCompleteee() (navigating to next state) 
                                     */}
                                    <p className="text-xs text-center text-muted-foreground">
                                        Do not worry, our team is super friendly! We want you to succeed. 🎉
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
export default MeetingSetup;