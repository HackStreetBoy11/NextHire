"use server";

import { currentUser } from "@clerk/nextjs/server";
import { StreamClient } from "@stream-io/node-sdk";
/*
    currentUser: gets hte logged-in user from clerk
    streamClient: allows backend communication with stream API (used for video/call features)
*/
export const streamTokenProvider = async () => {
    // declares an async funciton that will return a stream user token
    const user = await currentUser();
    if (!user) throw new Error("User not authenticated");
    //fetches the current user
    //if no user is loggged in throws error
    const streamClient = new StreamClient(
        process.env.NEXT_PUBLIC_STREAM_API_KEY!,
        process.env.STREAM_SECRET_KEY!
    );
    //creates a stream client instance using API keys for environment variable(.env files)
    const token = streamClient.generateUserToken({ user_id: user.id });
    // genereates a unique token for that user ID - requrierd to authenticate them in the stream service

    return token; // return the token used in joining/starting video call
};