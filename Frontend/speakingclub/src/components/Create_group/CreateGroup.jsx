import * as React from "react";
import Dialog from "@mui/material/Dialog";
import Zoom from "@mui/material/Zoom";
import stackedWavesImage from "../../Images/wave-haikei.png";
import './CreateGroup.css';
import Select from 'react-select';
import { useState,useEffect } from "react";
import { toast } from "react-toastify";
import {Link}from 'react-router-dom';
import { v1 as uuid } from 'uuid';



const Transition = React.forwardRef(function Transition(props, ref) {
  return <Zoom ref={ref} {...props} />;
});

export default function CreateGroup(props) {
  const gid = uuid();
  const s_gid=`room?gid=${gid}`;

  const options = [
    { value: 'English', label: 'English' },
    { value: 'Hindi', label: 'Hindi' },
    { value: 'Gujarati', label: 'Gujarati' },
    { value: 'Spanish', label: 'Spanish' },
    { value: 'Marathi', label: 'Marathi' },
    { value: 'Punjabi', label: 'Punjabi' },
  ]

  const option2 = [
    { value: '1', label: '1'},
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' }
  ];

  const option3 = [
    { value: 'Any Level', label: 'Any Level'},
    { value: 'Beginner', label: 'Beginner' },
    { value: 'Intermediate', label: 'Intermediate' },
    { value: 'Pro', label: 'Pro' },
  ];


  const [selectedLang, setSelectedLang] = useState([]);
  const [selectedSZ, setSelectedSZ] = useState({ value: '2', label: '2' });
  const [selectedLvl, setSelectedLvl] = useState({ value: 'Any Level', label: 'Any Level'});
  const [showPrompt, setShowPrompt] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  let SelectedLang;

  if(selectedLang.length===1){
    SelectedLang=selectedLang[0].label;
  }
  else if(selectedLang.length===2){
    SelectedLang=`${selectedLang[0].label} + ${selectedLang[1].label}`;
  }

 function formsubmit(e){
    props.setbackoff()
    
    //  e.preventDefault()
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        "maxLimit": selectedSZ.label,
        "language": SelectedLang,
        "level": selectedLvl.label,
        "info": inputValue ,
        "gid": gid
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };


      fetch("http://localhost:4000/creategroup", requestOptions)
        .then((response) => response.text())
        .then((result) => toast.success("Group Created !!!"))
        .catch((error) => console.error(error));

        setInputValue("")
        setSelectedSZ({ value: '2', label: '2' })
        setSelectedLang([])
        setSelectedLvl( { value: 'Any Level', label: 'Any Level'})
}

    const handleChange1 = selectedLang => {
        if (selectedLang.length <= 2) {
            setSelectedLang(selectedLang);
            setShowPrompt(false);
        } else {
            setShowPrompt(true);
        }
    };

    const handleChange2 = selectedSZ => {
          setSelectedSZ(selectedSZ);
    };

    const handleChange3 = selectedLvl => {
      setSelectedLvl(selectedLvl);
    };


  const handleChange = (e) => {
    const value = e.target.value;
    if (value.length <= 30) {
      setInputValue(value);
      setErrorMessage('');
    } else {
      setErrorMessage('Character limit exceeded!');
    }
  };

    const customStyles = {
      control: (provided, state) => ({
          ...provided,
          border: '1px solid #ccc',
          borderRadius: '4px',
          boxShadow: state.isFocused ? '0 0 0 1px #007bff' : null,
          '&:hover': {
              borderColor: '#007bff'
          }
      }),
      multiValue: (provided) => ({
          ...provided,
          backgroundColor: '#007bff',
          borderRadius: '20px',
          color: 'white'
      }),
      multiValueLabel: (provided) => ({
          ...provided,
          color: 'white'
      }),
      multiValueRemove: (provided) => ({
          ...provided,
          backgroundColor: 'transparent',
          color: 'white',
          '&:hover': {
              backgroundColor: '#0056b3',
              color: 'white'
          }
      }),
      input: (provided) => ({
          ...provided,
          height: 'auto' // Set height to auto to prevent increasing its height
      })
  };

 
  return (
    <Dialog
      sx={{
        '& .MuiDialog-paper': {
          width: '600px', // Correct width measurement
          maxHeight: '90%',
          minHeight: '430px',
          position: 'relative', // Ensure correct positioning
          overflow: 'hidden',
          backgroundImage: `url(${stackedWavesImage})`, // Use imported image directly
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover', // Adjust as per your requirement
        }
      }}
      TransitionComponent={Transition}
      onClose={props.setbackoff}
      open={props.backdrop}
    >
      
      
        <h2 style={{ marginLeft:'12rem',marginTop:'1rem', color: 'white' }}>Create Group</h2>
        <button className="button-87-1" onClick={props.setbackoff}>Close</button>

        <div>
        <form action="" className="form">

        
        
        <div className="f_one">
          <label htmlFor="" className="f_label">Language</label>
            <Select
                className="f_one_in"
                options={options}
                isMulti
                value={selectedLang}
                onChange={handleChange1}
                closeMenuOnSelect={false}
                styles={customStyles}
            />
            {showPrompt && <p style={{ marginLeft: '1rem', color: 'red' }}>You can only select up to two options.</p>}
        </div>



        <div className="f_two">
        <label htmlFor="" className="f_label_2">Group Size</label>
        <Select
          defaultValue={option2[1]}
          className="f_two_in"
          name="colors"
          options={option2}
          value={selectedSZ}
          onChange={handleChange2}
          classNamePrefix="select"
        ></Select>
           
        </div>

        <div className="f_three">
        <label  className="f_label_3">Topic</label>
        <input
        type="text"
        placeholder="Let's Talk"
        className="Topic_in"
        value={inputValue}
        onChange={handleChange}
      />
      {errorMessage && <p style={{ width:'12rem', color: 'red' }}>{errorMessage}</p>}
           
        </div>


        <div className="f_four">
        <label htmlFor="" className="f_label_4">Level</label>
        <Select
          className="f_four_in"
          defaultValue={option3[0]}
          name="colors"
          value={selectedLvl}
          onChange={handleChange3}
          options={option3}
          classNamePrefix="select"
        ></Select>
           
        </div>

          <Link className="button-87-2" target="_blank" onClick={(e)=>{formsubmit(e);}} to={s_gid} >Save</Link>
        </form>

      </div>
    </Dialog>
  );
}

