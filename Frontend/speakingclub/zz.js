// import './Room.css';
// import camon from '../../Images/camon.png';
// import camoff from '../../Images/camoff.png';
// import micon from '../../Images/micon.png';
// import micoff from '../../Images/micoff.png';
// import { useState } from 'react';
// import React, { useEffect, useRef } from "react";
// import io from "socket.io-client";
// import Peer from "simple-peer";
// import photo from "../../Images/stacked-peaks-haikei.png";
// import hang from '../../Images/hangup.png';
// import styled from 'styled-components';
// import Video from './Video';

// const urlParams = new URLSearchParams(window.location.search);
// const gid = urlParams.get('gid');
// let userID;
// const stunServerUrl = 'stun:stun.l.google.com:19302';


// export default function Room(props) {
//     const [cam, setCam] = useState(false);
//     const [mic, setMic] = useState(true);
//     const [vid, setVid] = useState("1");
//     const [ownStream,setOwnStream] = useState(null);

//     const [peers, setPeers] = useState([]);
//     const socketRef = useRef();
//     const peersRef = useRef([]);
//     const roomID = gid;

//     useEffect(() => {
//         socketRef.current = io.connect('http://localhost:4000', { transports: ['websocket'] });
//         socketRef.current.emit("join room", roomID);
//     },[]);

//     useEffect(()=>{
                
//                 socketRef.current.on("all users", users => {
//                     const peerss = [];
//                     users.forEach(userID => {
//                         const peer = createPeer(userID, socketRef.current.id, ownStream);
//                         peersRef.current.push({
//                             peerID: userID,
//                             peer,
//                         });
//                         peerss.push(peer);
//                     });
//                     setPeers(peerss);
//                 });

//                 socketRef.current.on("your id", payload => {
//                     userID=payload.userID;
//                     console.log(userID)
//                 });


//                 socketRef.current.on("user joined", payload => {
//                     const peer = addPeer(payload.signal, payload.callerID, ownStream);
//                     peersRef.current.push({
//                         peerID: payload.callerID,
//                         peer,
//                     });
//                     setPeers(prevPeers => [...prevPeers, peer]);
//                 });

//                 socketRef.current.on("receiving returned signal", payload => {
//                     const item = peersRef.current.find(p => p.peerID === payload.id);
//                     item.peer.signal(payload.signal);
//                 });

//                 // socketRef.current.on("stream changed", payload => {
//                 //     const { newpeer,userID } = payload;
//                 //     const peer = new Peer({
//                 //         newpeer
//                 //     });
//                 //     console.log("HI")
//                 //     console.log(newpeer)
//                 //     console.log(userID)
//                 //     const peerToUpdate = peersRef.current.find(p => p.peerID === userID);

//                 // });
           
//         },[]);


//     function createPeer(userToSignal, callerID, stream) {
//         const peer = new Peer({
//             initiator: true,
//             trickle: false,
//             stream,// Pass the stream only if the camera is on
//             config: { iceServers: [{ urls: stunServerUrl }] },
//         });

//         peer.on("signal", signal => {
//             socketRef.current.emit("sending signal", { userToSignal, callerID, signal });
//         });

//         return peer;
//     }

//     function addPeer(incomingSignal, callerID) {
//         let peerStream = null; // Variable to store received stream (if any)
      
//         try {
//           const peer = new Peer({
//             initiator: false,
//             trickle: false,
//             // Optionally include stream if received from caller
//             stream: peerStream,
//             config: { iceServers: [{ urls: stunServerUrl }] },
//           });
      
//           peer.on("signal", signal => {
//             socketRef.current.emit("returning signal", { signal, callerID });
//           });
      
//           peer.signal(incomingSignal);
      
//           peer.on("stream", stream => {
//             // Handle received stream from peer
//             peerStream = stream;
//             // Update the peer's stream in the peers array
//             const index = peersRef.current.findIndex(p => p.peer === peer);
//             if (index !== -1) {
//               peersRef.current[index].stream = stream;
//               // Trigger re-render or update the UI as needed
//               setPeers([...peersRef.current]);
//             }
//           });
      
//           peer.on("error", err => {
//             console.error("Error creating peer:", err);
//             // Handle errors (e.g., connection failure)
//           });
      
//           return peer;
//         } catch (error) {
//           console.error("Error adding peer:", error);
//           // Handle errors during peer object creation or signaling
//           return null;
//         }
//       }
    

//     function handleCam() {
//         if (!ownStream) {
//             // Turn on camera
//             navigator.mediaDevices.getUserMedia({ video: true, audio: true })
//                 .then((stream) => {
//                     setOwnStream(stream);
//                     peers.forEach((peer) => {
                       
//                         const index = peersRef.current.findIndex((p) => p.peer === peer);
//                         if (index !== -1) {
//                             // Update the stream in the peersRef array
//                             peersRef.current[index].stream = stream;
//                             // Signal to the peer about the stream change
//                             peer.signal({stream: stream });
//                         }
//                     });
//                 })
//                 .catch((error) => {
//                     console.error('Error accessing media devices:', error);
//                 });
//         } else {
//             // Turn off camera
//             ownStream.getTracks().forEach((track) => track.stop());
//             setOwnStream(null);
//             peers.forEach((peer) => {
//                 // Find the index of the current peer in the peers array
//                 const index = peersRef.current.findIndex((p) => p.peer === peer);
//                 if (index !== -1) {
//                     // Update the stream in the peersRef array to null
//                     peersRef.current[index].stream = null;
//                     // Signal to the peer about the stream change
//                     peer.signal({ type: 'stream_change', stream: null });
//                 }
//             });
//         }
    
//         setCam((prevState) => !prevState);
//     }
    
    

    
   
    

//     function handleMic() {
//         setMic(prevState => !prevState);
//         // // Update ownStream when mic toggles
//         // navigator.mediaDevices.getUserMedia({ video: cam, audio: !mic })
//         //     .then(stream => {
//         //         setOwnStream(stream);
//         //     })
//         //     .catch(error => {
//         //         console.error('Error accessing media devices:', error);
//         //     });
//     }
    

    

//     function click1() {
//         if (vid !== "1") setVid("1");
//     }

//     function click2() {
//         if (peers.length >= 1) {
//             if (vid !== "2") setVid("2");
//         }
//     }

//     function click3() {
//         if (peers.length >= 2) {
//             if (vid !== "3") setVid("3");
//         }
//     }

//     function click4() {
//         if (peers.length >= 3) {
//             if (vid !== "4") setVid("4");
//         }
//         console.log(peers[0])
//     }

//     return (
//         <>
//             <div id="room__container">
//                 <section id="members__container">
//                     <div id="members__header">
//                         <p className='dds'>Participants</p>
//                         <strong id="members__count">0</strong>
//                     </div>
//                     <div id="member__list"></div>
//                 </section>

//                 <section id="stream__container">

//                     {ownStream && vid.localeCompare("1") === 0 && <Video autoPlay playsInline own={ownStream} />}
                    
//                     {peers.length > 0 && vid.localeCompare("2") === 0 && <Video autoPlay playsInline peer={peers[0]} />}

//                     {peers.length > 1 && vid.localeCompare("3") === 0 && <Video autoPlay playsInline peer={peers[1]} />}

//                     {peers.length > 2 && vid.localeCompare("4") === 0 && <Video autoPlay playsInline peer={peers[2]} />}

//                     <div className="users__container">
//                         <button className='user1 ussr' onClick={click1}></button>
//                         <button className='user2 ussr' onClick={click2}></button>
//                         <button className='user3 ussr' onClick={click3}></button>
//                         <button className='user4 ussr' onClick={click4}></button>
//                     </div>
//                     <div className="stream__actions">
//                         <button style={{ border: 'none', background: 'none', cursor: 'pointer' }} onClick={handleCam}>
//                             <img className="cambtn" src={cam ? camon : camoff} alt="Toggle Camera" />
//                         </button>
//                         <button style={{ border: 'none', background: 'none', cursor: 'pointer' }} onClick={handleMic}>
//                             <img src={mic ? micon : micoff} alt="Toggle Microphone" className="mic-btn" />
//                         </button>
//                         <button style={{ border: 'none', background: 'none', cursor: 'pointer' }} >
//                             <img src={hang} alt="Toggle Microphone" className="hang-btn" />
//                         </button>
//                     </div>
//                 </section>
//                 <section id="messages__container">
//                     <div id="messages"></div>
//                     <form id="message__form">
//                         <input type="text" name="message" placeholder="Send a message...." />
//                     </form>
//                 </section>
//             </div>
//         </>
//     );
//     }


//         // useEffect(()=>{
//     //     navigator.mediaDevices.getUserMedia({ video: cam, audio: mic })
//     //         .then(stream => {
//     //             setOwnStream(stream);
                
//     //             socketRef.current.on("all users", users => {
//     //                 const peerss = [];
//     //                 users.forEach(userID => {
//     //                     const peer = createPeer(userID, socketRef.current.id, stream);
//     //                     peersRef.current.push({
//     //                         peerID: userID,
//     //                         peer,
//     //                     });
//     //                     peerss.push(peer);
//     //                 });
//     //                 setPeers(peerss);
//     //             });

//     //             socketRef.current.on("user joined", payload => {
//     //                 const peer = addPeer(payload.signal, payload.callerID, stream);
//     //                 peersRef.current.push({
//     //                     peerID: payload.callerID,
//     //                     peer,
//     //                 });
//     //                 setPeers(prevPeers => [...prevPeers, peer]);
//     //             });

//     //             socketRef.current.on("receiving returned signal", payload => {
//     //                 const item = peersRef.current.find(p => p.peerID === payload.id);
//     //                 item.peer.signal(payload.signal);
//     //             });
        
//     //         })
//     //         .catch(error => {
//     //             console.error('Error accessing media devices:', error);
//     //         });
//     // },[])