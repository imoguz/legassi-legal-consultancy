import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  searchText: '',
  results: [],
  tableState: {
    offset: 0,
    filters: {},
    sorter: {},
  },
};

const aiDocumentSearchSlice = createSlice({
  name: 'aiDocumentSearch',
  initialState,
  reducers: {
    setSearchText: (state, action) => {
      state.searchText = action.payload;
    },
    setSearchResults: (state, action) => {
      state.results = action.payload;
    },
    setTableState: (state, action) => {
      state.tableState = { ...state.tableState, ...action.payload };
    },
    clearSearch: (state) => {
      state.searchText = '';
      state.results = [];
      state.tableState = initialState.tableState;
    },
  },
});

export const { setSearchText, setSearchResults, setTableState, clearSearch } =
  aiDocumentSearchSlice.actions;
export default aiDocumentSearchSlice.reducer;
