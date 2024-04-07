import { useState } from 'react';
import './App.css';
import Header from './components/Header';
import { useState } from 'react';
import CreateGroup from './components/Create_group/CreateGroup';import 'bootstrap/dist/css/bootstrap.min.css';
import Card from './components/Groups';

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

  const [groups, setGroups] = useState([
    {
      maxLimit: 5,
      avatar: 'h',
      name: 'user',
      language: 'Hindi + English',
      level: 'advanced',
      info: 'time-pass',
      id: 1
    },
    {
      maxLimit: 9,
      avatar: 'h',
      name: 'user',
      language: 'Gujarati + English',
      level: 'advanced',
      info: 'time-pass',
      id: 2
    },
    {
      maxLimit: 8,
      avatar: 'h',
      name: 'user',
      level: 'Beginner',
      language: 'English',
      info: 'Tofel',
      id: 3
    },
    {
      maxLimit: 15,
      avatar: 'h',
      name: 'user',
      level: 'advanced',
      info: 'IELTS',
      language: 'Korean + English',
      id: 4
    },
  ]);

  return (
    <>
       <Header setbackon={setbackon} />
    <CreateGroup setbackoff={setbackoff} backdrop={backdrop}></CreateGroup>
      <div className='container' style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
      }}>
        {
          groups.map((group) => {
            return <Card key={group.id} data={group}/>;
          })
        }
      </div>
    </>
  );
}

export default App;
