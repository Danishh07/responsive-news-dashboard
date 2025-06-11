import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FilterState } from '@/types';

const initialState: FilterState = {
  author: null,
  dateFrom: null,
  dateTo: null,
  type: 'all',
  searchQuery: '',
};

export const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setAuthorFilter: (state, action: PayloadAction<string | null>) => {
      state.author = action.payload;
    },
    setDateRangeFilter: (state, action: PayloadAction<{ from: string | null, to: string | null }>) => {
      state.dateFrom = action.payload.from;
      state.dateTo = action.payload.to;
    },
    setTypeFilter: (state, action: PayloadAction<'all' | 'news' | 'blog'>) => {
      state.type = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearFilters: (state) => {
      state.author = null;
      state.dateFrom = null;
      state.dateTo = null;
      state.type = 'all';
      state.searchQuery = '';
    },
  },
});

export const {
  setAuthorFilter,
  setDateRangeFilter,
  setTypeFilter,
  setSearchQuery,
  clearFilters
} = filterSlice.actions;

export default filterSlice.reducer;
