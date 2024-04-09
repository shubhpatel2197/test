import { useEffect, useState } from "react";
import Card from "../Groups";
import './index.css';

export default function LoadGroup() {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    // Function to fetch groups
    const fetchGroups = async () => {
      try {
        const requestOptions = {
          method: "GET",
          redirect: "follow"
        };
        const response = await fetch("http://localhost:4000/allgroups", requestOptions);
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

  return (
    <div className='container1' >
      {groups.map((group) => <Card key={group.id} data={group} />)}
    </div>
  );
}
