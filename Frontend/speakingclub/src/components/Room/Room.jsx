import './Room.css';
import camon from '../../Images/camon.png';
import camoff from '../../Images/camoff.png';
import micon from '../../Images/micon.png';
import micoff from '../../Images/micoff.png';
import { useState } from 'react';
import React, { useEffect, useRef } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import photo from "../../Images/stacked-peaks-haikei.png";
import hang from '../../Images/hangup.png';
import styled from 'styled-components';
import Video from './Video'

const urlParams = new URLSearchParams(window.location.search);
const gid = urlParams.get('gid');


export default function Room(props){
   

    const [cam,setcam] = useState(false);
    const [mic,setmic] = useState(false);
    const [vid,setvid] = useState("1");

    
    function handleCam(){
        if(cam)setcam(false);
        else{
            setcam(true);
        }
    }

    function handleMic(){
        if(mic)setmic(false);
        else{
            setmic(true);
        }
    }

    const videoConstraints = {
        height: window.innerHeight / 2,
        width: window.innerWidth / 2
    };

    const [peers, setPeers] = useState([]);
    const [own, setown] = useState();
    const socketRef = useRef();
    // const userVideo = useRef();
    const peersRef = useRef([]);
    const roomID = gid;

    

    let mediaStream;

    useEffect(() => {
        socketRef.current = io.connect('http://localhost:4000',{ transports: ['websocket'] });

        if(!mediaStream){
           mediaStream = navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: false });
        }
        else{
            mediaStream.then(stream => {
               setown(stream);
                
                // userVideo.current.srcObject = stream;
                socketRef.current.emit("join room", roomID);

            socketRef.current.on("all users", users => {
                const peerss = [];
                users.forEach(userID => {
                    const peer = createPeer(userID, socketRef.current.id, stream);
                    peersRef.current.push({
                        peerID: userID,
                        peer,
                    })
                    peerss.push(peer);
                })
                setPeers(peerss);
            })

            socketRef.current.on("user joined", payload => {
                const peer = addPeer(payload.signal, payload.callerID, stream);
                peersRef.current.push({
                    peerID: payload.callerID,
                    peer,
                })
                setPeers(users => [...users, peer]);
            });

            socketRef.current.on("receiving returned signal", payload => {
                const item = peersRef.current.find(p => p.peerID === payload.id);
                item.peer.signal(payload.signal);
            });
        })

        }
        
        
    },[]);

    function createPeer(userToSignal, callerID, stream) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });

        peer.on("signal", signal => {
            socketRef.current.emit("sending signal", { userToSignal, callerID, signal })
        })

        return peer;
    }

    function addPeer(incomingSignal, callerID, stream) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        })

        peer.on("signal", signal => {
            socketRef.current.emit("returning signal", { signal, callerID })
        })

        peer.signal(incomingSignal);

        return peer;
    }

    function click1(){
        if(vid!=="1")setvid("1")
    }

    function click2(){
      if(peers.length >= 1){
        if(vid!=="2")setvid("2")
      }
    }

    function click3(){
        if(peers.length >= 2){
            if(vid!=="3")setvid("3")
        }
    }

    function click4(){
        if(peers.length >= 3){
            if(vid!=="4")setvid("4")
        }
    }
  
    return (
        <>

   
        <div id="room__container">

            <section id="members__container">

            <div id="members__header">
                <p className='dds'>Participants</p>
                <strong id="members__count">0</strong>
            </div>

            <div id="member__list">
            </div>

            </section>

            <section id="stream__container">

            {own && vid.localeCompare("1") === 0 && <Video autoPlay playsInline own={own} />}

            {peers.length>0 && vid.localeCompare("2") === 0 && <Video autoPlay playsInline peer={peers[0]} />}

            {peers.length>1 && vid.localeCompare("3") === 0 && <Video autoPlay playsInline peer={peers[1]} />}

            {peers.length>2 && vid.localeCompare("4") === 0 && <Video  autoPlay playsInline peer={peers[2]} />}

                <div className="users__container">
                <button className='user1 ussr' onClick={click1}></button>
                    <button className='user2 ussr' onClick={click2}></button>
                    <button className='user3 ussr' onClick={click3}></button>
                    <button className='user4 ussr' onClick={click4}></button>

                </div>

                

                <div className="stream__actions">
                    <button style={{ border: 'none', background: 'none', cursor: 'pointer' }}   onClick={handleCam}>
                        <img className="cambtn" src={cam ? camon : camoff} alt="Toggle Camera"/>
                    </button>

                    <button style={{ border: 'none', background: 'none', cursor: 'pointer' }}  onClick={handleMic}>
                        <img src={mic ? micon : micoff} alt="Toggle Microphone" className="mic-btn"/>
                    </button>

                    <button style={{ border: 'none', background: 'none', cursor: 'pointer' }} >
                        <img src={hang} alt="Toggle Microphone" className="hang-btn"/>
                    </button>

                </div>

               
            </section>

            <section id="messages__container">

                <div id="messages"></div>

                <form id="message__form">
                    <input type="text" name="message" placeholder="Send a message...." />
                </form>

            </section>
        </div>
    
        </>
    )
};