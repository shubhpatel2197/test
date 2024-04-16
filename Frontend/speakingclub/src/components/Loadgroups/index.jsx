import { useEffect, useState } from "react";
import Card from "../Groups";
import './index.css'
import { useNavigate } from "react-router-dom";


export default function LoadGroup() {
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Function to fetch groups
    const fetchGroups = async () => {
      try {
        const requestOptions = {
          method: "GET",
          redirect: "follow"
        };
        const response = await fetch("https://test-6-vdrh.onrender.com/allgroups", requestOptions);
        const result = await response.json();
        setGroups(result);
      } catch (error) {
        console.error(error);
      }
    };

    // Fetch groups immediately on mount
    fetchGroups();

    // Fetch groups at intervals
    const intervalId = setInterval(fetchGroups, 2000);

    // Cleanup function to clear interval
    return () => clearInterval(intervalId);
  }, []);

  function getuid(id){
    const navigationPath = `/room?gid=${id}`; 
    window.location.href = navigationPath;
  }
  

  return (
    <div className='container1' >
      {groups.map((group) => <Card key={group.gid} data={group} getgid={(id) => getuid(id)} />)}
    </div>
  );
}
