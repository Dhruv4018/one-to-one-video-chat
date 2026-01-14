"use client";
import React, { useEffect, useRef } from "react";

interface VideoRoomProps {
  roomId: string;
}

const VideoRoom = ({ roomId }: VideoRoomProps) => {
  const zpRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const start = async () => {
      // Unique user ID
      const userId = crypto.randomUUID();

      // Import Zego UIKit
      const { ZegoUIKitPrebuilt } = await import(
        "@zegocloud/zego-uikit-prebuilt"
      );

      // Generate token (test environment)
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        Number(process.env.NEXT_PUBLIC_ZEGO_APP_ID),
        process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET!,
        roomId,
        userId,
        "stranger"
      );

      // Create Zego instance
      const zp = ZegoUIKitPrebuilt.create(kitToken);
      zpRef.current = zp;

      // Join room - MULTI USER / GROUP CALL mode
      zpRef.current.joinRoom({
        container: containerRef.current,
        scenario: {
          mode: ZegoUIKitPrebuilt.GroupCall, // <-- Change for group call
        },
        showPreJoinView: false,
        showTextChat: true,
        maxUsers: 10, // <-- Allow up to 10 users
      });
    };

    start();

    // Cleanup on unmount
    return () => {
      if (zpRef.current) {
        try {
          zpRef.current.leaveRoom();
          zpRef.current.destroy();
        } catch (error) {
          zpRef.current = null;
          console.log(error);
        }
      }
    };
  }, [roomId]);

  return <div ref={containerRef} className="w-full h-[80vh]" />;
};

export default VideoRoom;
