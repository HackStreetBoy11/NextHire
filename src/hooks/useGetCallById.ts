/*
    This custom React hook fetches a meeting (or "call") from stream Video Api using its ID.
    It's mainly responseible for finding the call by ID and returning it to your component
*/

import { useEffect, useState } from "react";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
/*  
    useEffect, useState -- React hooks for side effects and managing state.
    useStreamVideoClient -- provides access to the stream video client instance
    call -- type from the stream SDK representing a video meeting
*/
const useGetCallById = (id: string | string[]) => {
    // This hook takes a meetingID id as input
    // sometimes, Next.js route parameters can be string | string[] , so it's typed for both
    const [call, setCall] = useState<Call>();
    const [isCallLoading, setIsCallLoading] = useState(true);
    /*
        call -> stores the fetched meeting
        isCallLoading -> indicates whether the data is still being fetched
    */
    const client = useStreamVideoClient();
    // this gives you access to the stream Video SDK client , which can query and manage calls
    useEffect(() => {
        if (!client) return;

        const getCall = async () => {
            try {
                const { calls } = await client.queryCalls({ filter_conditions: { id } });

                if (calls.length > 0) setCall(calls[0]);
            } catch (error) {
                console.error(error);
                setCall(undefined);
            } finally {
                setIsCallLoading(false);
            }
        };

        getCall();
    }, [client, id]);
    /*
        Runs whenever client or id changes
        calls client.queryCalls() -- this searches for calls that match the gievn id
        if a call is found, it saves it to call
        if not or if there's error , it sets call to undefiend
        after finishing , is callLoading becomes false


        So that page:
        Waits until isCallLoading is false.
        If call exists → shows meeting UI.
        If not → shows “Meeting not found.”
    */
    return { call, isCallLoading };
};

export default useGetCallById;