import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";
import { api } from "./_generated/api"
const http = httpRouter();
import { syncUser } from "./users";
/*
    httpRouter -> creates a convex Http router, which lets you handle HTTP endpoints instead of standard convex queries/mutations
    httpAction -> wraps a function to make it callable as an http endpoint in convex
    webhookEvent -> clerk type for webhook payloads (e.g. user.created, user.updated)
    webhook (from svix) -> validates the webhook's authenticity to prevent fake request.
    api -> generated convex api helper , used to call other convex function (syncUser) in this case
    syncUser -> your mutation that syncs a clerk user into convex database.
*/

//  initilizes a  convex http router to define endpoints.
// you will attach a webhook handler to this router.
http.route({
    path: "/clerk-webhook", // this is the URL clerk will call when a webhook event occurs.
    method: "POST",    // webhooks always send post request
    handler: httpAction(async (ctx, request) => { // httpAction -> converts your async funciton into a convex-compatible HTTP handler with access to (ctx(convex Context))
        const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
        if (!webhookSecret) {
            throw new Error("Missing CLERK_WEBHOOK_SECRET environment variable");
        }
        /*
            Pulls the secret from environment variable
            without this secret, webhook verification is impossible
            prevents unauthorized external requrests/
        */
        const svix_id = request.headers.get("svix-id");
        const svix_signature = request.headers.get("svix-signature");
        const svix_timestamp = request.headers.get("svix-timestamp");

        if (!svix_id || !svix_signature || !svix_timestamp) {
            return new Response("No svix headers found", {
                status: 400,
            });
        }
        /*  
            SVIX headres come with every clerk webhook
            Required for signature verification 
            Respond 400 if any header is missing -> rejects the request as invalid

        */

        const payload = await request.json();
        const body = JSON.stringify(payload);
        /*  
            Reads the incoming JSON webhook body
            converts back to string for svix.verify() - svix requires string input for HMAC verification
        */
        const wh = new Webhook(webhookSecret);
        let evt: WebhookEvent;

        try {
            evt = wh.verify(body, {
                "svix-id": svix_id,
                "svix-timestamp": svix_timestamp,
                "svix-signature": svix_signature,
            }) as WebhookEvent;
        } catch (err) {
            console.error("Error verifying webhook:", err);
            return new Response("Error occurred", { status: 400 });
        }
        /*
            creates a webhook instance with your secret
            .verify () checks that:
                1. the request really come from clerk
                2. The payload has not been tampered with
            Throws an error if verification fails -> rejected with 400
        */

        const eventType = evt.type;
        
        if (eventType === "user.created") {
            const { id, email_addresses, first_name, last_name, image_url } = evt.data;

            const email = email_addresses[0].email_address;
            const name = `${first_name || ""} ${last_name || ""}`.trim();

            try {
                await ctx.runMutation(api.users.syncUser, {
                    clerkId: id,
                    email,
                    name,
                    image: image_url,
                });
            } catch (error) {
                console.log("Error creating user:", error);
                return new Response("Error creating user", { status: 500 });
            }
        }
        /*
                Event type → user.created → fired when a new user signs up in Clerk.
                Extracts user info from webhook payload: ID, email, name, avatar.
                Calls a Convex mutation (syncUser) to create/update the user in your Convex DB.
                Error handling → logs and responds with 500 if syncing fails.
                💡 Suggestion: You can expand this to handle other events like:
                user.updated → update user info in your DB
                user.deleted → deactivate user
        */
        return new Response("Webhook processed successfully", { status: 200 });
        // if everything works, return 200 -> tells clerk webhook that the request succeeded
    }),
});

export default http;

// 🔹 What happens in your HTTP page
// Clerk User Signs Up
// The user goes to your app and clicks Sign Up or is redirected to Clerk’s SignIn/SignUp page.
// Clerk Fires user.created Event
// When the user completes signup, Clerk triggers a webhook: user.created.
// Clerk sends this event to your HTTP endpoint /clerk-webhook.
// Webhook Receives the Event
// Your Convex HTTP router (http.route) receives the POST request.
// It first verifies the webhook signature using svix to make sure the request is legitimate.
// Extract User Data
// From the webhook payload, you get:
// id → Clerk user ID
// email_addresses → user email
// first_name and last_name
// image_url → avatar
// You format this into your Convex-friendly structure (name, email, etc.).
// Sync User into Convex
// Calls ctx.runMutation(api.users.syncUser, { clerkId, email, name, image })
// This inserts the user into your Convex database, so now your app has a local record of the user.
// User Is Ready
// The next time the user logs into your app, their data is already in Convex.
// This allows all other modules (like interviews, comments) to link to this user.