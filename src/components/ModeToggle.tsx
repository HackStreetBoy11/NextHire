"use client"
// marks this file as a cliend component (runs in the browser)-requried for hooks like useTheme
import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
// imports react,two icons(moon,sum) and the useTheme hook to control the app's theme.

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
// imports styled UI components(button+ dropdown) from your design system(likely shadcn/ui)

export function ModeToggle() {
    const { setTheme } = useTheme()
    // defines the modeToggle component and gets the setTheme function function from the useTheme hook - allows switching theme
    return (
        <DropdownMenu>
            {/* renders a dropdown menu to hold the theme option */}
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            {/* 
                The trigger button:
                - sun: icon visible in light mode
                - moon icon visible in dark (using dar: tailwind classes to animate swap)
                - sr-only makes text hidden visully but readable by screen readers (accessibility)
                - smooth rotation and scaling animations handle icon trasition when theme changes
            */}
            <DropdownMenuContent align="end">
                {/* The dropdown content align to the right side of the button */}
                <DropdownMenuItem onClick={() => setTheme("light")}>
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                    System
                </DropdownMenuItem>
                {/* 
                    Each item sets a different theme when clicked
                        - light -> light mode
                        - dark -> dark mode
                        - system -> follows os/system theme perfernce
                */}
            </DropdownMenuContent>

        </DropdownMenu>
    )
}
