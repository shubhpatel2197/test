import React from 'react';

export default function Card({ data }) {
  const renderCircles = () => {
    const circles = [];
    for (let i = 0; i < data.maxLimit; i++) {
      circles.push(<div key={i} className="circle" style={circleStyle}></div>);
    }
    return circles;
  };

  const circleStyle = {
    width: '50px',
    height: '50px',
    border: '1px dotted white',

    borderRadius: '50%',
    display: 'inline-block',
    margin: '5px',
  };

  const circlesContainerStyle = {
    marginBottom: '10px', /* Adjust as needed */
  };

  return (
    <div className="card text-bg-dark" style={{ width: '40rem', marginTop: '20px' }}>
      <div className="card-body">
        <h5 className="card-title">{data.language} ({data.level})</h5>
        <p className="card-text">{data.info} </p>
        <div className="circles-container" style={circlesContainerStyle}>{renderCircles()}</div>
        <div style={{top:'40px', display:'flex', flexWrap:'wrap',justifyContent:'flex-end', alignContent:'flex-end',}}>
        <button className="btn btn-primary" >Join group</button>
        </div>
      </div>
    </div>
  );
}
