import { useEffect,useState } from "react";
import Card from "../Groups"
export default function LoadGroup(){
    const [groups, setGroups] = useState([]);
  useEffect(()=>{
    const fetcher = setInterval(()=>{
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };
    
    fetch("http://localhost:4000/allgroups", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setGroups(result);
    })
      .catch((error) => console.error(error));

  },2000);
  return ()=>{
    clearInterval(fetcher);
  }
  },[])
    return (
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
    )
}