import Header from '../Header';
import CreateGroup from '../Create_group/CreateGroup';
import LoadGroup from '../Loadgroups';
import {  useState } from 'react';
import './Home.css';

export default function Home(){
    const [backdrop, setbackdrop] = useState(false);

    function setbackoff(){
      setbackdrop(false);
    }
  
    function setbackon(){
      setbackdrop(true);
    }
    return (
        <div className='Home'>
            <Header setbackon={setbackon} />
             <CreateGroup setbackoff={setbackoff} backdrop={backdrop} />
              <LoadGroup />
        </div>
    )
}