import { useEffect, useState } from 'react';
import './App.css';
import Header from './components/Header';
import CreateGroup from './components/Create_group/CreateGroup';import 'bootstrap/dist/css/bootstrap.min.css';
import LoadGroup from './components/Loadgroups';

function App() {
  
  const [backdrop,setbackdrop] = useState(false);

  function setbackoff(){
    setbackdrop(false);
  }

  function setbackon(){
    setbackdrop(true);
  }


  

  return (
    <>
       <Header setbackon={setbackon} />
    <CreateGroup setbackoff={setbackoff} backdrop={backdrop}></CreateGroup>
      <LoadGroup></LoadGroup>
    </>
  );
}

export default App;
