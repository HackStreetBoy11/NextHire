"use client";
//  it mean this file will be executed in the browser(not on the server)
import Link from "next/link";
import { Button } from "./ui/button";
import { SparklesIcon } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
/*
    line 3 - faster than <a>tag  and background or prerender the component no reloading of page
    line 4 - it's a styled button that supports props like size,className etc
    Luice is a modern icon library  used often with Tailwind or shadCN
    imports a custom Reach hook that you built -- likely determines the logged-in user's role
*/
function DasboardBtn() {
    const { isCandidate, isLoading } = useUserRole();
    /*  
        calls your useUserRole() hook
        Destructures isCandidate and isLoading from the returned object
        This line determines who the current user is
    */
    if (isCandidate || isLoading) return null;
    /*  
        if the user is a candidate or the role is still loading, the component returns null -- meeting it renders nothing
            this prevents showing the dashboard button to candidates or before role is known
    */

    return (
        <Link href={"/dashboard"}>
            {/* 
                When clicked, navigates to /dashboard.
            */}
            <Button className="gap-2 font-medium" size={"sm"}>
                {/* 
                    A small (sm) button with a bit of space (gap-2) between icon and text, and medium font weight
                */}
                <SparklesIcon className="size-4" />
                {/* 
                    Adds a small decorative icon to the left of the text
                */}
                Dashboard
            </Button>
        </Link>
    );
}
export default DasboardBtn;