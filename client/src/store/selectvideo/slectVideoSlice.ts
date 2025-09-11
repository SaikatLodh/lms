import { createSlice } from "@reduxjs/toolkit";

interface selectVideoState {
  id: string | null;
}
const initialSate: selectVideoState = {
  id: null,
};

const selectVideoSlice = createSlice({
  name: "selectVideo",
  initialState: initialSate,
  reducers: {
    selectVideo: (state, action) => {
      state.id = action.payload;
    },
  },
});

export const { selectVideo } = selectVideoSlice.actions;
export default selectVideoSlice.reducer;
