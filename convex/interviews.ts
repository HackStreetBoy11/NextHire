// 🧠 FILE PURPOSE
// This file manages interview sessions — including creation, fetching, and updating their status (like ongoing, completed, etc).
// Each record represents a live video interview call between a candidate and one or more interviewers, and links to your Stream call through the streamCallId.

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getAllInterviews = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const interviews = await ctx.db.query("interviews").collect();

        return interviews;
    },
});
/*
    export const getAllInterviews =  query({}) defines a convex query callable from the client
    handler: async (ctx) => { handles receives ctx with db,auth,etc.
    const  identity = await ctx.auth.getUserIdentity() -- fetches auth identity (from clerk via convex auth bridge)
    if(!identity) throw new Error("Unauthorized") --  denies unauthenticated access.
*/

export const getMyInterviews = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];

        const interviews = await ctx.db
            .query("interviews")
            .withIndex("by_candidate_id", (q) => q.eq("candidateId", identity.subject))
            .collect();

        return interviews!;
    },
});
/*  
    fetches identity; if missing it returns []  (instead of throwing)
    Queries interviews using index by_candidate_id where candidateId === identity.subject.
    Returns the list
*/
export const getInterviewByStreamCallId = query({
    args: { streamCallId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("interviews")
            .withIndex("by_stream_call_id", (q) => q.eq("streamCallId", args.streamCallId))
            .first();
    },
});
/*  
    Declares an args shape : {streamCallId: string}
    Queries interviews with index by_stream_call_id and calls .first() to return one result or null 

    Note & suggestions:
        Index uniqueness : if streamCallId should be unique , enforece in schema or ensure you generate unique stream IDs
        Auth: No auth check --- anyone can call this and get interview data. Decide wheterh this endpoint should be public 
        Return value: could be null --- client should handle that
*/

export const createInterview = mutation({
    args: {
        title: v.string(),
        description: v.optional(v.string()),
        startTime: v.number(),
        status: v.string(),
        streamCallId: v.string(),
        candidateId: v.string(),
        interviewerIds: v.array(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        return await ctx.db.insert("interviews", {
            ...args,
        });
    },
});
/*
    Mutation with strict arg validation using v
    Auth check --- only logged-in users can create.
    Inserts the record into the interviews table

    📘 Note:
    streamCallId connects your app to Stream.io — that’s how your frontend knows which live call belongs to which interview record.

*/

export const updateInterviewStatus = mutation({
    args: {
        id: v.id("interviews"),
        status: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.patch(args.id, {
            status: args.status,
            ...(args.status === "completed" ? { endTime: Date.now() } : {}),
        });
    },
});

/*
    This is a  mutation , meaning it modifies existing data.
    It takes:   
            id (must be a valid convex id from the interviews table)
            status (like "ongoing","completed",etc)
    then it updates the record with the new status.
    if the new status is "completed", it also adds an endTime timestamp automatically.
*/