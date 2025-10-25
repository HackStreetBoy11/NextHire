import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// add a new comment
export const addComment = mutation({
    args: {
        interviewId: v.id("interviews"),
        content: v.string(),
        rating: v.number(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");
        /*
            only logged-in users can add comments
            identity.subject will be the interviewer's unique clerk ID, which you store as interviewerId.
        */

        return await ctx.db.insert("comments", {
            interviewId: args.interviewId,
            content: args.content,
            rating: args.rating,
            interviewerId: identity.subject,
        });
        /*
                create a new record in the comments table
                stores which interviewer wrote hte comment.
                Timestamp fields (createAt/updatedAt) are not included here -- could be added for auditing
        */

    },
});
/*
export const addComment = mutation({...})
    defines a function callable from your frontend that modifies the database
    arguments(args)
            interviewId -> ensures the comment is linked ot a valid interview record. convex check this at runtime
            content -> string content of the comment
            rating-> numeric rating for the candidate (could be 1-5 or any scale you choose)

*/

// get all comments for an interview
export const getComments = query({
    args: { interviewId: v.id("interviews") },
    // only requires the id of the interview
    handler: async (ctx, args) => {
        const comments = await ctx.db
            .query("comments")
            .withIndex("by_interview_id", (q) => q.eq("interviewId", args.interviewId))
            .collect();
        /*  
            uses a convex index to effieciently fetch all comments linked to a particular interview
            .collect() returns an array of matching comments.
        */
        return comments;
    },
});
