import * as React from "react";
import Dialog from "@mui/material/Dialog";
import Zoom from "@mui/material/Zoom";
import stackedWavesImage from "/Users/shubh/speakingClub/Frontend/speakingclub/src/Images/wave-haikei.png";
import '/Users/shubh/speakingClub/Frontend/speakingclub/src/components/Create_group/CreateGroup.css';


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Zoom ref={ref} {...props} />;
});

export default function CreateGroup(props) {
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
      <div>
        <h2>H</h2>
        <button className="button-87-1" onClick={props.setbackoff}>Close</button>
        <form action="">
          <input type="submit" />
          <input type="submit" />
          <input type="submit" />
          <input type="submit" />
          <button className="button-87-2">Save</button>
        </form>
      </div>
    </Dialog>
  );
}
