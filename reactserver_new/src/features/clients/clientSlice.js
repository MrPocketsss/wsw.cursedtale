import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

/*-----------------------------------------------------------------------------
                               firebase triggers
-----------------------------------------------------------------------------*/
const fetchAgencies = createAsyncThunk(
  'clients/fetchInitialAgencies',
  async (a = {}, { dispatch, getState }) => {
    // const {
    //   rowsPerPageOptions,
    //   agencyList: { order, orderByProperty },
    // } = getState().clients;
    // return db
    //   .collection('agency_info')
    //   .orderBy(orderByProperty, order)
    //   .limit(rowsPerPageOptions[rowsPerPageOptions.length - 1])
    //   .get()
    //   .then((snapshot) => {
    //     const isEmpty = snapshot.size === 0;
    //     console.log('snapshot: ', snapshot);
    //     console.log('isEmpty: ', isEmpty);
    //     if (isEmpty) return { docs: [], lastDoc: null };
    //     return updateStore(dispatch, snapshot);
    //   })
    //   .catch((error) => {
    //     throw Error(error.message);
    //   });
  }
);
const createAgency = createAsyncThunk(
  'clients/createAgency',
  async (project, { getState }) => {
    // const { currentUser } = getState().auth;
    // return db
    //   .collection('agency_info')
    //   .add({
    //     ...project,
    //     'author id': currentUser.id,
    //     created: Date.now(),
    //     currentUsers: 0,
    //     isActive: true,
    //   })
    //   .catch((error) => {
    //     throw Error(error.message);
    //   });
  }
);
const fetchMoreAgencies = createAsyncThunk(
  'clients/fetchMoreAgencies',
  async (a = {}, { dispatch, getState }) => {
    // const {
    //   rowsPerPageOptions,
    //   agencyList: { order, orderByProperty, nextStart },
    // } = getState().clients;
    // const lastDocRef = await db.doc(`agency_info/${nextStart}`).get();
    // db.collection('agency_info')
    //   .orderBy(orderByProperty, order)
    //   .startAfter(lastDocRef)
    //   .limit(rowsPerPageOptions[rowsPerPageOptions.length - 1])
    //   .get()
    //   .then((snapshot) => {
    //     const isEmpty = snapshot.size === 0;
    //     if (isEmpty) return {};
    //     return updateStore(dispatch, snapshot);
    //   })
    //   .catch((error) => {
    //     throw Error(error.message);
    //   });
  }
);

const getDoc = (doc) => {
  return { id: doc.id, ...doc.data() };
};
const updateStore = (dispatch, snapshot) => {
  const docs = snapshot.docs.map((doc) => getDoc(doc));
  console.log('documents: ', docs);
  const lastDoc = snapshot.docs[snapshot.docs.length - 1].id;
  console.log('last document: ', lastDoc);
  return { docs, lastDoc };
};

/*-----------------------------------------------------------------------------
                        Comparing and sorting functions
                          (not needed with firebase)
-----------------------------------------------------------------------------*/
// function stableSort(array, comparator) {
//   const stabilizedThis = array.map((element, index) => [element, index]);
//   stabilizedThis.sort((a, b) => {
//     const order = comparator(a[0], b[0]);
//     if (order !== 0) return order;
//     return a[1] - b[1];
//   });
//   return stabilizedThis.map((element) => element[0]);
// }
// function getComparator(order, orderBy) {
//   return order === "asc"
//     ? (a, b) => descendingComparator(a, b, orderBy)
//     : (a, b) => -descendingComparator(a, b, orderBy);
// }
// function descendingComparator(a, b, orderBy) {
//   if (b[orderBy] < a[orderBy]) return -1;
//   if (b[orderBy] > a[orderBy]) return 1;
//   return 0;
// }

/*-----------------------------------------------------------------------------
                            Reducer Slice
-----------------------------------------------------------------------------*/
const clientSlice = createSlice({
  name: 'clients',
  initialState: {
    isLoaded: false,
    isPending: false,
    errorMessage: null,
    successMessage: null,
    rowsPerPageOptions: [5, 10, 25],
    agencyList: {
      nextStart: null,
      currentRowsPerPageIndex: 0,
      currentPage: 0,
      endOfData: false,
      denseRows: false,
      order: 'asc',
      orderByProperty: 'created',
      selected: [],
      data: {
        head: [
          {
            id: 'name',
            numeric: false,
            isDate: false,
            disablePadding: true,
            label: 'Agency Name',
          },
          {
            id: 'referral',
            numeric: false,
            isDate: false,
            disablePadding: true,
            label: 'Referral Code',
          },
          {
            id: 'currentUsers',
            numeric: true,
            isDate: false,
            disablePadding: false,
            label: 'Active Users',
          },
          {
            id: 'maxUsers',
            numeric: true,
            isDate: false,
            disablePadding: false,
            label: 'Max Users',
          },
          {
            id: 'created',
            numeric: false,
            isDate: true,
            disablePadding: true,
            label: 'Agency Created',
          },
          {
            id: 'isActive',
            numeric: false,
            isDate: false,
            disablePadding: true,
            label: 'Active',
          },
        ],
        body: [],
      },
      title: 'Agencies',
    },
  },
  reducers: {
    currentRowsPerPageChange(state, { payload: { currentTable, value } }) {
      const index = state.rowsPerPageOptions.indexOf(value);
      state[currentTable].currentRowsPerPageIndex = index;
      state[currentTable].currentPage = 0;
    },
    modifySelected(state, { payload: { currentTable, name } }) {
      state[currentTable].selected = state[currentTable].selected.includes(name)
        ? state[currentTable].selected.filter((prevName) => prevName !== name)
        : [...state[currentTable].selected, name];
    },
    pageChange(state, { payload: { currentTable, newPage } }) {
      state[currentTable].currentPage = newPage;
    },
    selectAll(state, { payload }) {
      state[payload].selected = state[payload].data.body.map((n) => n.name);
    },
    selectNone(state, { payload }) {
      state[payload].selected = [];
    },
    setDensity(state, { payload: { currentTable, checked } }) {
      state[currentTable].denseRows = checked;
    },
    sortBy(state, { payload: { currentTable, property } }) {
      const isAsc =
        state[currentTable].orderByProperty === property &&
        state[currentTable].order === 'asc';
      const newOrder = isAsc ? 'desc' : 'asc';
      state[currentTable].order = newOrder;
      state[currentTable].orderByProperty = property;
    },
  },
  extraReducers: {
    // any time we need to fetch a fresh batch (initial load, order changes)
    [fetchAgencies.pending]: (state) => {
      state.isPending = true;
      state.errorMessage = null;
      state.successMessage = null;
    },
    [fetchAgencies.rejected]: (state, { error }) => {
      state.isPending = false;
      state.errorMessage = error.message;
      state.successMessage = null;
    },
    [fetchAgencies.fulfilled]: (state, { payload }) => {
      console.log('payload received: ', payload);
      const agencyUpperBound =
        state.rowsPerPageOptions[state.rowsPerPageOptions.length - 1];

      state.isPending = false;
      state.errorMessage = null;
      state.successMessage = 'fetch complete';

      state.agencyList.nextStart = payload.lastDoc;
      state.agencyList.data.body = payload.docs;
      state.agencyList.endOfData =
        payload.docs.length < agencyUpperBound ? true : false;
    },

    // add new agency
    [createAgency.pending]: (state) => {
      state.isPending = true;
      state.errorMessage = null;
      state.successMessage = null;
    },
    [createAgency.rejected]: (state, { error }) => {
      state.isPending = false;
      state.errorMessage = error.message;
      state.successMessage = null;
    },
    [createAgency.fulfilled]: (state) => {
      state.isPending = false;
      state.errorMessage = null;
      state.successMessage = 'Agency successfully added';
    },

    // fetch more data
    [fetchMoreAgencies.pending]: (state) => {
      state.isPending = true;
      state.errorMessage = null;
      state.successMessage = null;
    },
    [fetchMoreAgencies.rejected]: (state, { error }) => {
      state.isPending = false;
      state.errorMessage = error.message;
      state.successMessage = null;
    },
    [fetchMoreAgencies.fulfilled]: (state, { payload }) => {
      const agencyUpperBound =
        state.rowsPerPageOptions[state.rowsPerPageOptions.length - 1];

      state.isPending = false;
      state.errorMessage = null;
      state.successMessage = 'fetch complete';

      state.agencyList.nextStart = payload.lastDoc;
      state.agencyList.data.body = payload.docs;
      state.agencyList.endOfData =
        payload.docs.length < agencyUpperBound ? true : false;
    },
  },
});

/* -----------------------------------------------------------------------------
                                  Exports
-----------------------------------------------------------------------------*/
export { createAgency, fetchAgencies, fetchMoreAgencies }; // async thunks
export const {
  currentRowsPerPageChange,
  modifySelected,
  pageChange,
  selectAll,
  selectNone,
  setDensity,
  sortBy,
} = clientSlice.actions;
export default clientSlice.reducer;
