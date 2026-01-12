"use client";
import React, { useEffect, useRef } from "react";

const VideoRoom = ({ roomId }: { roomId: string }) => {
  const zpRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const start = async () => {
      const userId = crypto.randomUUID();
      const { ZegoUIKitPrebuilt } = await import(
        "@zegocloud/zego-uikit-prebuilt"
      );
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        Number(process.env.NEXT_PUBLIC_ZEGO_APP_ID),
        process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET!,
        roomId,
        userId,
        "stranger"
      );
      const zp = ZegoUIKitPrebuilt.create(kitToken);
      zpRef.current = zp;
      zpRef.current.joinRoom({
        container: containerRef.current,

        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall,
        },
        showPreJoinView: false,
        showTextChat: true,
        maxUsers: 2,
      });
    };
    start();
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
