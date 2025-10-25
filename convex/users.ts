import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
/*
  V: A convex validator used to define the expected data types of arguments passed to queries/mutations.
  mutation: Used to define write operations (insert,update, delete)
  query:Used to define read operation(fetch data).
*/

export const syncUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    clerkId: v.string(),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .first();

    if (existingUser) return;

    return await ctx.db.insert("users", {
      ...args,
      role: "candidate",
    });
  },
});
/*
  This mutation expects a user's name , email,clerkId and an optional image
  ctx(context) gives access to :
      ctx.db -> database operations
      ctx.auth -> authentication(user identity)
      ctx.storage -> file storage (if used)
  
    ctx.db.query("users") ->selects the users table
    .filter() -> filters rows where clerkId == args.clerkId.
    .first() -> returns the first match(or null if not found).
    👉 This checks if the current Clerk user already exists in Convex.
*/

export const getUsers = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("User is not authenticated");
    const users = await ctx.db.query("users").collect();
    return users;
  },
});
/*  
  gets the current logged-in clerk user identity
  if not logged in -> throws error
  Ensures only authenticated users can call this query

  .collect() returns all documents in the users table.
  Returns them as an array.
*/

export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    // Takes a clerk Id (string ) as input
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();
    // uses the indexed field by_clerk_id (create in your schema file).
    //efficiently searches for the user by clerkId
    return user;
    // return the found user document (or null)
  },
});

// 🔁 Flow:

// User signs in via Clerk.

// You call syncUser to store user details in Convex.

// When dashboard loads, getUserByClerkId fetches user info.

// You can display their name, image, or role on the UI.