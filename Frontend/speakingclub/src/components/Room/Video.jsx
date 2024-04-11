import React, { useState, useEffect, useRef } from "react";
import Peer from "simple-peer";

export default function Video(props) {
  const ref = useRef();
  let assignedStream;
  
  useEffect(() => {
    
    if (props.peer) {
      assignedStream = props.peer.streams[0];
    } else if (props.own) {
      assignedStream = props.own;
    }

    if (assignedStream) {
      ref.current.srcObject = assignedStream;
    } else {
      console.warn("No video stream available"); // Handle missing stream
    }

    
    
  }, []);

  const getVideoBoxClass = (props) => {
    return `streams__container video_box ${props.peer ? 'kk' : ''}`;
  }

  return (
    <video
    className={getVideoBoxClass(props)}
      playsInline
      autoPlay
      ref={ref}
    />
  );
}