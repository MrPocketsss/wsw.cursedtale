// import react libraries
import React from "react";

// import modules
import { Link, Typography } from "@material-ui/core";

// import project files

export default function Copyright() {
  return (
    <Typography variant='body2' color='textSecondary' align='center'>
      {"Copyright © "}
      <Link color='inherit' href='www.linear-systems.com'>
        Linear Systems
      </Link>
      {" " + new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
