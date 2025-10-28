import { CODING_QUESTIONS, LANGUAGES } from "@/constants";
import { useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./ui/resizable";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { AlertCircleIcon, BookIcon, LightbulbIcon } from "lucide-react";
import Editor from "@monaco-editor/react";

/*
    CODING_QUESTIONS: an array of question objects(title,description,examples,constraints,startCode)
    Language: an array of supported language (e.g. Javascript,python, java)
    ResizablePanelGroup: from your UI library -- lets you split screen vertically or horizontally, and drag to 
    resize the question panel and code editor panel
    scrollArea: adds scrollable containers for overflowing content
    select components: for dropdowns (choosing question or language)
    card: structured,styled container for question content
    icons (BookIcon,LightbulbIcon, AlertCircleIcon)- visully label each section
    @monaco-editor/react-> the core vs code-like code editor embedded in browser
*/

function CodeEditor() {
    const [selectedQuestion, setSelectedQuestion] = useState(CODING_QUESTIONS[0]);
    const [language, setLanguage] = useState<"javascript" | "python" | "java">(LANGUAGES[0].id);
    const [code, setCode] = useState(selectedQuestion.starterCode[language]);
    /*
        selectQuestion: stores the currently active coding problem
            - initially set to the first question in CODING_QUESTIONS.
        language: Stores the selected language (default=first one,probably javascript)
        code: stores the current code in the editor
            - starts with the starter code for the selected question + selected language
        These three  states are interlinked -- when the question or language changes, the editor content updates
        accordingly
    */


    const handleQuestionChange = (questionId: string) => {
        const question = CODING_QUESTIONS.find((q) => q.id === questionId)!;
        setSelectedQuestion(question);
        setCode(question.starterCode[language]);
    };
    /*
        finds the selected question by ID
        updates the selectedQuestion state
        updates the code editor with the question's starter code for the current language
    */

    const handleLanguageChange = (newLanguage: "javascript" | "python" | "java") => {
        setLanguage(newLanguage);
        setCode(selectedQuestion.starterCode[newLanguage]);
    };
    /*
        updates language whnen user switches
        sets code editor to teh corresponding starter code for that question in the new language
    */

    return (
        <ResizablePanelGroup direction="vertical" className="min-h-[calc-100vh-4rem-1px]">
            {/* 
                direction="vertical"-> top(question) and bottom (editor) panels
                min-h-[calc-100vh-4rem-1px]: full screen height minus navbar or margin space
            */}
            {/* QUESTION SECTION */}
            <ResizablePanel>
                <ScrollArea className="h-full">
                    <div className="p-6">
                        {/* 
                            first resizable panel -> for problem details
                            scrollArea: allows long questions to scroll independnetly
                            p-6: padding inside the section
                        */}
                        <div className="max-w-4xl mx-auto space-y-6">
                            {/* HEADER */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                {/* Responsive layout -> question title and selectors side-by-side on larger screens */}
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-2xl font-semibold tracking-tight">
                                            {selectedQuestion.title}
                                        </h2>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Choose your language and solve the problem
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Select value={selectedQuestion.id} onValueChange={handleQuestionChange}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Select question" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {CODING_QUESTIONS.map((q) => (
                                                <SelectItem key={q.id} value={q.id}>
                                                    {q.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <Select value={language} onValueChange={handleLanguageChange}>
                                        <SelectTrigger className="w-[150px]">
                                            {/* SELECT VALUE */}
                                            <SelectValue>
                                                <div className="flex items-center gap-2">
                                                    <img
                                                        src={`/${language}.png`}
                                                        alt={language}
                                                        className="w-5 h-5 object-contain"
                                                    />
                                                    {LANGUAGES.find((l) => l.id === language)?.name}
                                                </div>
                                            </SelectValue>
                                        </SelectTrigger>
                                        {/* SELECT CONTENT */}
                                        <SelectContent>
                                            {LANGUAGES.map((lang) => (
                                                <SelectItem key={lang.id} value={lang.id}>
                                                    <div className="flex items-center gap-2">
                                                        <img
                                                            src={`/${lang.id}.png`}
                                                            alt={lang.name}
                                                            className="w-5 h-5 object-contain"
                                                        />
                                                        {lang.name}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {/* 
                                        the first select -> switch between coding questions.
                                        the second select -> switch between supported languages (with flags/icons
                                        loaded dynamically  from /public/{lang}.png)
                                    */}
                                </div>
                            </div>

                            {/* PROBLEM DESC. */}
                            <Card>
                                <CardHeader className="flex flex-row items-center gap-2">
                                    <BookIcon className="h-5 w-5 text-primary/80" />
                                    <CardTitle>Problem Description</CardTitle>
                                </CardHeader>
                                <CardContent className="text-sm leading-relaxed">
                                    <div className="prose prose-sm dark:prose-invert max-w-none">
                                        <p className="whitespace-pre-line">{selectedQuestion.description}</p>
                                    </div>
                                </CardContent>
                            </Card>
                            {/* 
                                Displays the problem statement
                                uses tailwind typography (prose) for nice formatting
                                whitespace-pre-line -> preserve line breaks
                            */}

                            {/* PROBLEM EXAMPLES */}
                            <Card>
                                <CardHeader className="flex flex-row items-center gap-2">
                                    <LightbulbIcon className="h-5 w-5 text-yellow-500" />
                                    <CardTitle>Examples</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ScrollArea className="h-full w-full rounded-md border">
                                        <div className="p-4 space-y-4">
                                            {selectedQuestion.examples.map((example, index) => (
                                                <div key={index} className="space-y-2">
                                                    <p className="font-medium text-sm">Example {index + 1}:</p>
                                                    <ScrollArea className="h-full w-full rounded-md">
                                                        <pre className="bg-muted/50 p-3 rounded-lg text-sm font-mono">
                                                            <div>Input: {example.input}</div>
                                                            <div>Output: {example.output}</div>
                                                            {example.explanation && (
                                                                <div className="pt-2 text-muted-foreground">
                                                                    Explanation: {example.explanation}
                                                                </div>
                                                            )}
                                                        </pre>
                                                        <ScrollBar orientation="horizontal" />
                                                    </ScrollArea>
                                                </div>
                                            ))}
                                            {/* 
                                                Displays test exmaple with input, output and optional explanation
                                                Each inside a scrollable code block
                                                clean formatted using font-mono and muted background
                                            */}

                                        </div>
                                        <ScrollBar />
                                    </ScrollArea>
                                </CardContent>
                            </Card>

                            {/* CONSTRAINTS */}
                            {selectedQuestion.constraints && (
                                <Card>
                                    <CardHeader className="flex flex-row items-center gap-2">
                                        <AlertCircleIcon className="h-5 w-5 text-blue-500" />
                                        <CardTitle>Constraints</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="list-disc list-inside space-y-1.5 text-sm marker:text-muted-foreground">
                                            {selectedQuestion.constraints.map((constraint, index) => (
                                                <li key={index} className="text-muted-foreground">
                                                    {constraint}
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            )}

                            {/* 
                                Displays problem constraints if available 
                                example
                                    -- 1<=nums.length <= 10^5
                                        0<=nums[i]<=1000
                            */}
                        </div>
                    </div>
                    <ScrollBar />
                </ScrollArea>
            </ResizablePanel>

            <ResizableHandle withHandle />
            {/* visual draggable divider that lets you resize top(question) and bottom (editor) panels interactively */}
            {/* CODE EDITOR */}
            <ResizablePanel defaultSize={60} maxSize={100}>
                <div className="h-full relative">
                    <Editor
                        height={"100%"}
                        defaultLanguage={language}
                        language={language}
                        theme="vs-dark"
                        value={code}
                        onChange={(value) => setCode(value || "")}
                        options={{

                            fontSize: 18,
                            lineNumbers: "on",
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                            padding: { top: 16, bottom: 16 },
                            wordWrap: "on",
                            wrappingIndent: "indent",
                        }}
                    />
                </div>
            </ResizablePanel>
            {/* 
                Monaco Editor component:
                    -- language: dynamically matches user-selected language.
                    -- theme="vs-darl": gives a dark VS Code theme
                    value={code}: bound to react state, live updates
                    onchange: updates code state when user types
                options: configure  editor behavior (font-size, padding, layout etc)
                defaultSize(60)-> the editor takes up 60% of available height by defalt
            */}
        </ResizablePanelGroup>
    );
}
export default CodeEditor;