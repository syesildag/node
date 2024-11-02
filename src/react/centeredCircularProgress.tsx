import { CircularProgress } from "@mui/material";
import * as React from 'react';

interface Props {
   size?: number | string;
}

const CenteredCircularProgress = (props: Props) => {
   const size = props.size ? props.size : "4em";
   return (
      <div id={"loading_spinner"} style={{
         position: "fixed",
         top: "50%",
         left: "50%",
         transform: "translate(-50%, -50%)"
      }}>
         <CircularProgress color={'primary'} size={size} />
      </div>
   );
};

export default CenteredCircularProgress;