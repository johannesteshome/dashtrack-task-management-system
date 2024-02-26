import { createSlice } from "@reduxjs/toolkit";
import {
  CreateNewProject,
  DeleteProject,
  GetMyProjects,
  GetOneProject,
} from "./dataActions";

const initialState = {
  myProjects: null,
  currentProject: null,
  loading: false,
  loggedInUser: null,
  logs: null,
};

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(CreateNewProject.pending, (state) => {
        state.loading = true;
      })
      .addCase(CreateNewProject.fulfilled, (state, action) => {
        console.log(action, "slice");
        state.loading = false;
      })
      .addCase(CreateNewProject.rejected, (state) => {
        state.loading = false;
      })
      .addCase(GetMyProjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetMyProjects.fulfilled, (state, action) => {
        console.log(action, "slice");
        state.loading = false;
        state.myProjects = action.payload.result.data;
      })
      .addCase(GetMyProjects.rejected, (state) => {
        state.loading = false;
      })
      .addCase(GetOneProject.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetOneProject.fulfilled, (state, action) => {
        console.log(action, "slice");
        state.loading = false;
        state.currentProject = action.payload.project;
      })
      .addCase(GetOneProject.rejected, (state) => {
        state.loading = false;
      })
      .addCase(DeleteProject.pending, (state) => {
        state.loading = true;
      })
      .addCase(DeleteProject.fulfilled, (state, action) => {
        console.log(action, "slice");
        state.loading = false;
        state.currentProject = null;
      })
      .addCase(DeleteProject.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const {} = dataSlice.actions;

export default dataSlice.reducer;
