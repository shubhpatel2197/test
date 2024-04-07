import './App.css';
import Header from './components/Header';
import { useState } from 'react';
import CreateGroup from './components/Create_group/CreateGroup';

function App() {

  const [backdrop,setbackdrop] = useState(false);

  function setbackoff(){
    setbackdrop(false);
  }

  function setbackon(){
    console.log(backdrop);
    setbackdrop(true);
  }

  console.log(backdrop);

  return (
    <>
     <Header setbackon={setbackon}/>
    <CreateGroup setbackoff={setbackoff} backdrop={backdrop}></CreateGroup>
    </>
  );
}

export default App;
