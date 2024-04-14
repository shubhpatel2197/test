import React, { useState, useEffect, useRef } from "react";
import Peer from "simple-peer";


export default function Video(props) {
  const ref = useRef();
  let assignedStream;
  
  useEffect(() => {
      ref.current.srcObject = props.own;
  }, [props.cam]);

  if(!props.cam && props.mic){
    const audioTracks = props.own.getAudioTracks();
    const audioStream = new MediaStream(audioTracks);
    ref.current.srcObject = audioStream;
  }

  const getVideoBoxClass = (props) => {
    return `img_box video_box ${!props.cam ? "disp" : ""}`;
}


  return (
    <>
      <video muted={props.mic ? false : true} className={getVideoBoxClass(props)} playsInline autoPlay ref={ref}></video>
    </>
  );
}