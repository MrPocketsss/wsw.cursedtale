// import React libraries
import React from "react";

// import modules
import { useDispatch, useSelector } from "react-redux";
import {
  FormControlLabel,
  Paper,
  Switch,
  Table,
  TableContainer,
} from "@material-ui/core";

// import project files
import useStyles from "./styles";
import {
  ReduxTableBody,
  ReduxTableHead,
  ReduxTableToolbar,
} from "../molecules";
import { ReduxTablePagination } from "../atoms";
import { setDensity } from "../../features/clients/clientSlice";

export default function ReduxTable(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { currentTable } = props;
  const denseRows = useSelector(
    (state) => state.clients[currentTable].denseRows
  );

  const handleChangeDense = (event) => {
    dispatch(setDensity({ currentTable, checked: event.target.checked }));
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <ReduxTableToolbar currentTable={currentTable} />
        <TableContainer className={classes.tableContainer}>
          <Table
            className={classes.table}
            aria-labelledby='tableTitle'
            size={denseRows ? "small" : "medium"}
            aria-label='table'
          >
            <ReduxTableHead currentTable={currentTable} />
            <ReduxTableBody currentTable={currentTable} />
          </Table>
        </TableContainer>
        <ReduxTablePagination currentTable={currentTable} />
      </Paper>
      <FormControlLabel
        control={<Switch checked={denseRows} onChange={handleChangeDense} />}
        label='Dense Padding'
      />
    </div>
  );
}
