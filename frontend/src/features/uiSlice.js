import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    currentView: 'landing', 
  },
  reducers: {
    setView: (state, action) => {
      state.currentView = action.payload;
    },
  },
});

export const { setView } = uiSlice.actions;
export default uiSlice.reducer;