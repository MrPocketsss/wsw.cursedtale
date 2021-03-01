// import react libraries
import React, { useEffect } from "react";

// import modules
import { useDispatch, useSelector } from "react-redux";
import { Checkbox, TableBody, TableCell, TableRow } from "@material-ui/core";
import moment from "moment";

// import project files
import {
  fetchMoreAgencies,
  modifySelected,
} from "../../features/clients/clientSlice";

export default function ReduxTableBody(props) {
  const dispatch = useDispatch();
  const { currentTable } = props;
  const sortedData = useSelector(
    (state) => state.clients[currentTable].data.body
  );
  const headCells = useSelector(
    (state) => state.clients[currentTable].data.head
  );
  const currentPage = useSelector(
    (state) => state.clients[currentTable].currentPage
  );
  const denseRows = useSelector(
    (state) => state.clients[currentTable].denseRows
  );
  const currentOptionIndex = useSelector(
    (state) => state.clients[currentTable].currentRowsPerPageIndex
  );
  const rowsPerPageOptions = useSelector(
    (state) => state.clients.rowsPerPageOptions
  );
  const selected = useSelector((state) => state.clients[currentTable].selected);

  const rowsPerPage = rowsPerPageOptions[currentOptionIndex];
  const rowsUpperBound = rowsPerPageOptions[rowsPerPageOptions.length - 1];
  const firstInPage = currentPage * rowsPerPage;
  const lastInPage = currentPage * rowsPerPage + rowsPerPage;
  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, sortedData.length - currentPage * rowsPerPage);

  const isSelected = (name) => selected.includes(name);
  const handleSelectRow = (event, name) => {
    dispatch(modifySelected({ currentTable, name }));
  };

  useEffect(() => {
    const willNeedFetch =
      sortedData.length - currentPage * rowsPerPage < rowsUpperBound
        ? true
        : false;
    console.log(willNeedFetch);
    if (sortedData > 0 && willNeedFetch) dispatch(fetchMoreAgencies());
  }, [sortedData, currentPage, rowsPerPage, rowsUpperBound, dispatch]);

  return (
    <TableBody>
      {[...sortedData].slice(firstInPage, lastInPage).map((row, index) => {
        const isItemSelected = isSelected(row.name);
        const labelId = `redux-table-checkbox-${index}`;

        return (
          <TableRow
            hover
            onClick={(event) => handleSelectRow(event, row.name)}
            role='checkbox'
            aria-checked={isItemSelected}
            tabIndex={-1}
            key={index}
            selected={isItemSelected}
          >
            <TableCell padding='checkbox'>
              <Checkbox
                checked={isItemSelected}
                inputProps={{ "aria-labelledby": labelId }}
              />
            </TableCell>
            {headCells.map((column, index) => {
              return index === 0 ? (
                <TableCell
                  key={index}
                  component='th'
                  id={labelId}
                  scope='row'
                  padding='none'
                >
                  {row[column.id]}
                </TableCell>
              ) : (
                <TableCell
                  key={index}
                  align={column.numeric ? "right" : "left"}
                >
                  {column.isDate
                    ? moment(new Date(row[column.id])).fromNow()
                    : row[column.id]}
                </TableCell>
              );
            })}
          </TableRow>
        );
      })}
      {emptyRows > 0 && (
        <TableRow style={{ height: (denseRows ? 33 : 55) * emptyRows }}>
          <TableCell colSpan={headCells.length + 1} />
        </TableRow>
      )}
    </TableBody>
  );
}
