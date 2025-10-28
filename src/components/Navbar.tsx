import Link from "next/link";
import { ModeToggle } from "./ModeToggle";
import { CodeIcon } from "lucide-react";
import { SignedIn, UserButton } from "@clerk/nextjs";
import DasboardBtn from "./DashboardBtn";
/*
    Link - for client-side navigation in Next.js
    ModeToggle- dark/light theme switcher
    CodeIcon - logo icon from lucide-react
    SignedIn & UserButton -- clerk components for authentication (only show inside SignedIn)
    
*/

function Navbar() {
    // creates a <nav> element with a bottom border , separating it visually from page contnent
    return (
        <nav className="border-b">
            <div className="flex h-16 items-center px-4 container mx-auto">
                {/* LEFT SIDE -LOGO */}
                <Link
                    href="/"
                    className="flex items-center gap-2 font-semibold text-2xl mr-6 font-mono hover:opacity-80 transition-opacity"
                >
                    <CodeIcon className="size-8 text-emerald-500" />
                    <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                        CodeIng
                    </span>
                </Link>
                {/* 
                    Link redirects to home (/)
                    codeIcon serves as the app icon
                    span displays app name "CodeIng" with a green-to-teal gradient
                    hover: opacity-80 adds hover feedback
                */}


                {/* RIGHT SIDE - ACTIONS */}
                <SignedIn>
                    <div className="flex items-center space-x-4 ml-auto">
                        <DasboardBtn />
                        <ModeToggle />
                        <UserButton />
                    </div>
                </SignedIn>
                {/* 
                    SignedIn ensures this area shows only when a user is authenticated via clerk
                    DashboardBtn - visible only to interviewers(not candidates)
                    ModeToggle - theme switcher
                    UserButton - Clerk's build-in porfile avatar with dropdown for sign-out or settings
                    ml=auto pushes everything to the right edge
                */}
            </div>
        </nav>
    );
}
export default Navbar;