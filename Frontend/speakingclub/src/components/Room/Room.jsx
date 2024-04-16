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
import Video from './Video';
import img from '../../Images/video.png'
// import ChatBox from '../ChatBox';

const urlParams = new URLSearchParams(window.location.search);
const gid = urlParams.get('gid');
const sz = urlParams.get('sz');
let userID;
const stunServerUrl = 'stun:stun.l.google.com:19302';
let OwnStream;
let cnt=0;
let current = {};
const peersid = [];
const invpeersid = {};


export default function Room(props) {
    console.log(gid)

    const [cam, setCam] = useState(false);
    const [mic, setMic] = useState(false);
    const [vid, setVid] = useState("1");
    const [reset,setreset] = useState({});
    const [remoteStream,setRemoteStreams] = useState([]);
    

    const [peers, setPeers] = useState([]);
    const [socketConnected,setSocketConnected] = useState(false);
    const socketRef = useRef();
    const peersRef = useRef([]);
    const roomID = gid;



    useEffect(()=>{
        
        socketRef.current = io.connect('https://test-6-vdrh.onrender.com', { transports: ['websocket'] });
        socketRef.current.on('connect', () => {
            console.log('Connected to socket server');
            setSocketConnected(true);
        });
         
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream=>{

                OwnStream=stream;
                socketRef.current.emit("join room", roomID);
            
                socketRef.current.on("all users", users => {
                    const peerss = [];
                    users.forEach(userID => {
                        const peer = createPeer(userID, socketRef.current.id, stream);
                        peersRef.current.push({
                            peerID: userID,
                            peer,
                        })
                        peersid.push(userID);
                        invpeersid[userID]=peersid.length-1;
                        peerss.push(peer);
                    })
                    setPeers(peerss);
                   
                })
    

                socketRef.current.on("your id", payload => {
                    userID=payload.userID;
                    // console.log(payload)
                });

                socketRef.current.on("current", payload => {
                    current = payload;
                    //   console.log(payload)
                });


                socketRef.current.on("user joined", payload => {
                    const peer = addPeer(payload.signal, payload.callerID, stream);
                    peersRef.current.push({
                        peerID: payload.callerID,
                        peer,
                    });
                    setPeers(prevPeers => [...prevPeers, peer]);
                    peersid.push(payload.callerID);
                    invpeersid[payload.callerID]=peersid.length-1;

                    current[payload.callerID]={cam:payload.cam,mic:payload.mic}
                    
                });

                socketRef.current.on("receiving returned signal", payload => {
                    const item = peersRef.current.find(p => p.peerID === payload.id);
                    item.peer.signal(payload.signal);
                });

                socketRef.current.on("user stream changed", payload => {
                    console.log(payload)
                    if(payload.userID!==userID && payload.userID){
                        current[payload.userID].cam=payload.cam;
                        current[payload.userID].mic=payload.mic;
                        setreset(payload);
                    }
                });

                socketRef.current.on("user left", payload => {
                    let userleft = payload.userID;
                    if(payload.userID!==userID && payload.userID){
                        current[payload.userID].cam=payload.cam;
                        current[payload.userID].mic=payload.mic;
                        setreset(payload);
                    }
                });
                
            })





            // return () => {
            //     delete current[userID];
            //     delete peersid[invpeersid[userID]];
            //     delete invpeersid[userID];

            //     socketRef.current.disconnect(); // Disconnect socket when component unmounts
            // };

           
        },[]);


        function createPeer(userToSignal, callerID, stream) {
            const peer = new Peer({
                initiator: true,
                trickle: false,
                stream,
                config: { iceServers: [{ urls: stunServerUrl }] }
            });
    
            peer.on("signal", signal => {
                socketRef.current.emit("sending signal", { userToSignal, callerID, signal,cam,mic })
            })

            peer.on('stream', remoteStream => {
                setRemoteStreams(prevStreams => [...prevStreams, remoteStream]);
            });
    
            return peer;
        }
    
        function addPeer(incomingSignal, callerID, stream) {
            const peer = new Peer({
                initiator: false,
                trickle: false,
                stream,
                config: { iceServers: [{ urls: stunServerUrl }] }
            })
    
            peer.on("signal", signal => {
                socketRef.current.emit("returning signal", { signal, callerID,cam,mic })
            })

            peer.on('stream', remoteStream => {
                setRemoteStreams(prevStreams => [...prevStreams, remoteStream]);
            });
    
            peer.signal(incomingSignal);
    
            return peer;
        }
    

    function handleCam() {
    
        setCam((prevState) => !prevState);

        if (!cam) {
            OwnStream.getTracks()[0].enabled = true;
            socketRef.current.emit("stream changed",{cam:true,mic:mic,userID:userID});    
        } else if(cam){           
            OwnStream.getTracks()[0].enabled = false;
            socketRef.current.emit("stream changed",{cam:false,mic:mic,userID:userID});   
        }

    }
    

    function handleMic() {
        setMic(prevState => !prevState);
       
        if (!mic) {
            socketRef.current.emit("stream changed",{cam:cam,mic:true,userID:userID});    
        }
        else{
            socketRef.current.emit("stream changed",{cam:cam,mic:false,userID:userID});   
        }
    }
    

    function click1() {
        if (vid !== "1") setVid("1");
    }

    function click2() {
        if (peers.length >= 1) {
            if (vid !== "2") setVid("2");
        }
    }

    function click3() {
        if (peers.length >= 2) {
            if (vid !== "3") setVid("3");
        }
    }

    function click4() {
        if (peers.length >= 3) {
            if (vid !== "4") setVid("4");
        }
    }

    // console.log(OwnStream)
    // if(Object.keys(current).length>1){
    //     console.log(peers[0].streams[0])
    //     console.log(remoteStream[0])
    // }
    

    return (
        <>
            <div id="room__container">
                <section id="members__container">
                    <div id="members__header">
                        <p className='dds'>Participants</p>
                        <strong id="members__count">0</strong>
                    </div>
                    <div id="member__list"></div>
                </section>

                <section id="stream__container">

                  <div className='videos'>

                    {<Video mic={mic} cam={cam} autoPlay playsInline own={OwnStream}/> }
                    {!cam && <img className='img_box' src={img} alt="2323" />}
                    
                    { Object.keys(current).length>1 && <Video cam={current[peersid[0]].cam} mic={current[peersid[0]].mic} autoPlay playsInline own={remoteStream[0]}/> }
                    { (Object.keys(current).length>1 && !current[peersid[0]].cam)  && <img className='img_box' src={img} alt="2323" /> }
                    { Object.keys(current).length<=1 && <img className='img_box' src={img} alt="2323" /> }

                    { Object.keys(current).length>2 && <Video cam={current[peersid[1]].cam} mic={current[peersid[1]].mic} autoPlay playsInline own={remoteStream[1]}/> }
                    { (Object.keys(current).length>2 && !current[peersid[1]].cam)  && <img className='img_box' src={img} alt="2323" /> }
                    { Object.keys(current).length<=2 && <img className='img_box' src={img} alt="2323" /> }

                    { Object.keys(current).length>3 && <Video cam={current[peersid[2]].cam} mic={current[peersid[2]].mic} autoPlay playsInline own={remoteStream[2]}/> }
                    { (Object.keys(current).length>3 && !current[peersid[2]].cam)  && <img className='img_box' src={img} alt="2323" /> }
                    { Object.keys(current).length<=3 && <img className='img_box' src={img} alt="2323" /> }

                  </div>


                    <div className="users__container">
                        <button className='user1 ussr' onClick={click1}></button>
                        <button className='user2 ussr' onClick={click2}></button>
                        <button className='user3 ussr' onClick={click3}></button>
                        <button className='user4 ussr' onClick={click4}></button>
                    </div>
                    <div className="stream__actions">
                        <button style={{ border: 'none', background: 'none', cursor: 'pointer' }} onClick={handleCam}>
                            <img className="cambtn" src={cam ? camon : camoff} alt="Toggle Camera" />
                        </button>
                        <button style={{ border: 'none', background: 'none', cursor: 'pointer' }} onClick={handleMic}>
                            <img src={mic ? micon : micoff} alt="Toggle Microphone" className="mic-btn" />
                        </button>
                        <button style={{ border: 'none', background: 'none', cursor: 'pointer' }} >
                            <img src={hang} alt="Toggle Microphone" className="hang-btn" />
                        </button>
                    </div>
                </section>

                <section id="messages__container">

                </section>
            </div>
        </>
    );
};

