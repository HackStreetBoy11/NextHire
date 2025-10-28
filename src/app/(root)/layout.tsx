// 🧠 Purpose
// This file defines a Layout wrapper that provides the Stream client context to all pages/components nested inside it.
// It ensures that all children have access to the StreamClient — used for live video calls, chats, or recordings (from Stream.io SDK).

import StreamClientProvider from "@/components/providers/StreamClientProvider";
// initialize stream.io client (using an API key and user token)
// wraps all children inside a react context that allows them to use Stream's hooks and components (like video,call,recording,etc)
function Layout({ children }: { children: React.ReactNode }) {
    //     ➡️ Defines a React functional component called Layout.
    // It receives children as props — that means everything nested inside this layout will be rendered here.
    // TypeScript type { children: React.ReactNode } ensures that children can be any valid React elements.
    return <StreamClientProvider>{children}</StreamClientProvider>;
    //     Wraps all children inside the StreamClientProvider.
    // This means every child component (pages, sub-layouts, etc.) automatically gets access to the Stream.io video context (user sessions, calls, recordings, etc.).
}
export default Layout;

// ⚙️ Summary
// Layout acts as a global wrapper that provides Stream.io’s functionality (video calls, recordings, etc.) to all pages inside it.
// ✅ In simple terms:
// Every page inside this layout can now:
// Make video calls
// Fetch recordings
// Use Stream hooks like useCall()
// without needing to set up the Stream client again.