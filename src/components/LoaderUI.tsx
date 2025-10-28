import { LoaderIcon } from "lucide-react";

function LoaderUI() {
    // h-16 + 1 for border in navbar => 65px
    return (
        <div className="h-[calc(100vh-4rem-1px)] flex items-center justify-center">
            {/*
                you: my navbar takes up 4rem (1rem =16 px) plus a 1px border so isubstracted the total form the 
                viewpart height (100vh)  
             */}
            <LoaderIcon className="h-8 w-8 animate-spin text-muted-foreground" />
            {/* 
                animated spin continuously rotates it
            */}
        </div>
    );
}
export default LoaderUI;