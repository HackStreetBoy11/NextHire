import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
/*
defineSchema: used to define the overall database schema for Convex (like table in Sql)
defineTable: used to define a single table (like users, interviews,comments)
v: comes from convex/values, used to declare data types and validate values(like v.string(),v.number()).
*/

export default defineSchema({
    /*
        you're exporting your schema as the default export.
        convex uses this file(schema.ts or schema.js) automatically to build and validate your database structure
    */ 
    users: defineTable({
        name: v.string(),
        email: v.string(),
        image: v.optional(v.string()),
        role: v.union(v.literal("candidate"), v.literal("interviewer")), // can only be "candidate" or "interviewer"- ensures data consistency
        clerkId: v.string(),
    }).index("by_clerk_id", ["clerkId"]),
    /*
        creates a convex index so you can quickly find a user using their clerk ID.
        example - const user = useQuery(api.users.getByClerkId, { clerkId: userId });

    */
    interviews: defineTable({
        title: v.string(),
        description: v.optional(v.string()),
        startTime: v.number(),
        endTime: v.optional(v.number()),
        status: v.string(), // "SCHEDULED, IN-PROGRESS, COMPLETED"
        streamCallId: v.string(),
        candidateId: v.string(),// links to users table (the candidate's clerk ID)
        interviewerIds: v.array(v.string()),
    })
        .index("by_candidate_id", ["candidateId"])
        // Lets you fetch all interviews of a particular candidate efficiently
        .index("by_stream_call_id", ["streamCallId"]),
        //Lets you look up the interview by its stream call session ID (useful when joining a call).
    /*

    */

    comments: defineTable({
        content: v.string(),
        rating: v.number(),
        interviewerId: v.string(),
        interviewId: v.id("interviews"),
    }).index("by_interview_id", ["interviewId"]),
    /*
        Helps fetch all comments for one interview efficiently
    */
});
