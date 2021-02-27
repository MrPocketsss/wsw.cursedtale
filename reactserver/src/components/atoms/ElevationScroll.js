// import react libraries
import React from 'react';

// import modules
import { useScrollTrigger } from '@material-ui/core';

export default function ElevationScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });
  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}
