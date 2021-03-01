// import react libraries
import React from "react";

// import modules
import { TablePagination } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";

// import project files
import {
  pageChange,
  currentRowsPerPageChange,
} from "../../features/clients/clientSlice";

export default function ReduxTablePagination(props) {
  const dispatch = useDispatch();
  const { currentTable } = props;
  const options = useSelector((state) => state.clients.rowsPerPageOptions);
  const count = useSelector(
    (state) => state.clients[currentTable].data.body.length
  );
  const page = useSelector((state) => state.clients[currentTable].currentPage);
  const currentOptionIndex = useSelector(
    (state) => state.clients[currentTable].currentRowsPerPageIndex
  );
  const currentOption = useSelector(
    (state) => state.clients.rowsPerPageOptions[currentOptionIndex]
  );

  const handleChangePage = (event, newPage) => {
    dispatch(pageChange({ currentTable, newPage }));
  };

  const handleChangeRowsPerPage = (event) => {
    dispatch(
      currentRowsPerPageChange({ currentTable, value: event.target.value })
    );
  };

  return (
    <TablePagination
      rowsPerPageOptions={options}
      component='div'
      count={count}
      page={page}
      rowsPerPage={currentOption}
      onChangePage={handleChangePage}
      onChangeRowsPerPage={handleChangeRowsPerPage}
      labelDisplayedRows={({ from, to, count }) => `Page ${page + 1}`}
      labelRowsPerPage='Show:'
    />
  );
}
