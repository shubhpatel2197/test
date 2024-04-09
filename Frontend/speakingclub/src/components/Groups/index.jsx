import React from 'react';
import './index.css'

export default function Card({ data }) {
  const renderCircles = () => {
    const circles = [];
    for (let i = 0; i < data.maxLimit; i++) {
      circles.push(<div key={i} className="circle" style={circleStyle}></div>);
    }
    return circles;
  };

  let circleStyle;

  let circlesContainerStyle = {
    marginBottom: '10px', /* Adjust as needed */
  };

  let bttn;


  if(data.maxLimit===1){
    circleStyle = {
      width: '8rem',
      height: '8rem',
      border: '1px dotted white',
      borderRadius: '50%',
      display: 'inline-block',
      marginLeft: '4rem',
      marginTop:'1rem'
    };
    circlesContainerStyle = {
      display: 'flex', // Making the container a flex container
      justifyContent: 'center',
      flexWrap:'wrap', // Centering content horizontally
      marginTop:'-1.2rem',
      marginLeft:'0.4rem',
      width:'21rem',
    };
    bttn = {
      marginTop:'-0.4rem',
    }
  }

  if(data.maxLimit===2){
    circleStyle = {
      width: '7rem',
      height: '7rem',
      border: '1px dotted white',
  
      borderRadius: '50%',
      display: 'inline-block',
      marginLeft: '2rem',
      marginTop:'1rem'
    };
    circlesContainerStyle = {
      display: 'flex', // Making the container a flex container
      justifyContent: 'center',
      flexWrap:'wrap', // Centering content horizontally
      marginTop:'-1.2rem',
      marginLeft:'0.4rem',
      width:'21rem',
    };
    bttn = {
      marginTop:'0.4rem',
    }
  }

  if(data.maxLimit===3){
    circleStyle = {
      width: '6.5rem',
      height: '6.5rem',
      border: '1px dotted white',
      borderRadius: '50%',
      display: 'inline-block',
      marginLeft: '2rem',
      marginTop:'-1rem',
      marginBottom:'0.5rem'
    };
    circlesContainerStyle = {
      display: 'flex', // Making the container a flex container
      justifyContent: 'center',
      flexWrap:'wrap', // Centering content horizontally
      marginLeft: '-1.3rem', 
      width:'21rem',
      
    };
  }

  if(data.maxLimit===4){
    circleStyle = {
      width: '6rem',
      height: '6rem',
      border: '1px dotted white',
      borderRadius: '50%',
      display: 'inline-block',
      marginLeft: '1.2rem',
     
      marginBottom:'0.6rem'
    };
    circlesContainerStyle = {
      display: 'flex', // Making the container a flex container
      justifyContent: 'center',
      flexWrap:'wrap', // Centering content horizontally
      marginTop:'-1.2rem',
      marginLeft:'0.4rem',
      width:'21rem',
      
    };
  }



  

  return (
    <div className="card-1">
      <div className="card-body">
        <h5 className="card-title1">{data.language} ({data.level})</h5>
        <p className="card-text1">{data.info} </p>
        <div className="circles-container" style={circlesContainerStyle}>{renderCircles()}</div>
        <div style={{top:'40px', display:'flex', flexWrap:'wrap',justifyContent:'flex-end', alignContent:'flex-end',}}>
        
        <button className="button-27" style={bttn}>Join Group</button>

 
        </div>
      </div>
    </div>
  );
}
