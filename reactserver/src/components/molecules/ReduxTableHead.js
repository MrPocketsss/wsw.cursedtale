// import react libraries
import React from "react";

// import modules
import { useDispatch, useSelector } from "react-redux";
import {
  Checkbox,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@material-ui/core";

// import project files
import useStyles from "./styles";
import {
  selectAll,
  selectNone,
  sortBy,
} from "../../features/clients/clientSlice";

export default function ReduxTableHead(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { currentTable } = props;
  const headCells = useSelector(
    (state) => state.clients[currentTable].data.head
  );
  const numSelected = useSelector(
    (state) => state.clients[currentTable].selected.length
  );
  const rowCount = useSelector(
    (state) => state.clients[currentTable].data.body.length
  );
  const order = useSelector((state) => state.clients[currentTable].order);
  const orderByProperty = useSelector(
    (state) => state.clients[currentTable].orderByProperty
  );

  const handleCheckChange = (event) => {
    if (event.target.checked) {
      dispatch(selectAll(currentTable));
    } else {
      dispatch(selectNone(currentTable));
    }
  };
  const createSortHandler = (property) => (event) => {
    dispatch(sortBy({ currentTable, property }));
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding='checkbox'>
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={handleCheckChange}
            inputProps={{ "aria-label": "select all" }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={orderByProperty === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderByProperty === headCell.id}
              direction={orderByProperty === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderByProperty === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
