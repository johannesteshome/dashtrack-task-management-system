import { createSlice } from "@reduxjs/toolkit";
import {
  CreateNewProject,
  DeleteProject,
  GetAllNotifications,
  GetMyProjects,
  GetOneProject,
  GetUnreadNotifications,
  ReadNotification,
  DeleteNotification,
  AcceptInvitation,
  InviteUsers,
  CreateTeam,
  UpdateUser,
  FetchCurrentUser
} from "./dataActions";

const initialState = {
  myProjects: null,
  currentProject: null,
  loading: false,
  loggedInUser: null,
  logs: null,
  unreadNotifications: 0,
  notifications: null,
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
      })
      .addCase(GetUnreadNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetUnreadNotifications.fulfilled, (state, action) => {
        console.log(action, "slice");
        state.loading = false;
        state.unreadNotifications = action.payload.unreadNotifications;
      })
      .addCase(GetUnreadNotifications.rejected, (state) => {
        state.loading = false;
      })
      .addCase(GetAllNotifications.pending, (state) => {
        // state.loading = true;
      })
      .addCase(GetAllNotifications.fulfilled, (state, action) => {
        console.log(action, "slice");
        // state.loading = false;
        state.notifications = action.payload.notifications;
      })
      .addCase(GetAllNotifications.rejected, (state) => {
        // state.loading = false;
      })
      .addCase(ReadNotification.pending, (state) => {
        // state.loading = true;
      })
      .addCase(ReadNotification.fulfilled, (state, action) => {
        console.log(action, "slice");
        // state.loading = false;
        // state.notifications = action.payload.notifications;
      })
      .addCase(ReadNotification.rejected, (state) => {
        // state.loading = false;
      })
      .addCase(DeleteNotification.pending, (state) => {
        // state.loading = true;
      })
      .addCase(DeleteNotification.fulfilled, (state, action) => {
        console.log(action, "slice");
        // state.loading = false;
        // state.notifications = action.payload.notifications;
      })
      .addCase(DeleteNotification.rejected, (state) => {
        // state.loading = false;
      })
      .addCase(InviteUsers.pending, (state) => {
        // state.loading = true;
      })
      .addCase(InviteUsers.fulfilled, (state, action) => {
        console.log(action, "slice");
        // state.loading = false;
        // state.notifications = action.payload.notifications;
      })
      .addCase(InviteUsers.rejected, (state) => {
        // state.loading = false;
      })
      .addCase(AcceptInvitation.pending, (state) => {
        // state.loading = true;
      })
      .addCase(AcceptInvitation.fulfilled, (state, action) => {
        console.log(action, "slice");
        // state.loading = false;
        // state.notifications = action.payload.notifications;
      })
      .addCase(AcceptInvitation.rejected, (state) => {
        // state.loading = false;
      })
      .addCase(CreateTeam.pending, (state) => {
        // state.loading = true;
      })
      .addCase(CreateTeam.fulfilled, (state, action) => {
        console.log(action, "slice");
        // state.loading = false;
        // state.notifications = action.payload.notifications;
      })
      .addCase(CreateTeam.rejected, (state) => {
        // state.loading = false;
      })
      .addCase(UpdateUser.pending, (state) => {
        // state.loading = true;
      })
      .addCase(UpdateUser.fulfilled, (state, action) => {
        console.log(action, "slice");
        state.loggedInUser = action.payload.user;
        // state.loading = false;
        // state.notifications = action.payload.notifications;
      })
      .addCase(UpdateUser.rejected, (state) => {
        // state.loading = false;
      })
      .addCase(FetchCurrentUser.pending, (state) => {
        // state.loading = true;
      })
      .addCase(FetchCurrentUser.fulfilled, (state, action) => {
        console.log(action.payload, 'action payload');
        console.log(action, "slice");
        state.loggedInUser = action.payload.user;
        // state.loading = false;
        // state.notifications = action.payload.notifications;
      })
      .addCase(FetchCurrentUser.rejected, (state) => {
        // state.loading = false;
      });
  },
});

export const {} = dataSlice.actions;

export default dataSlice.reducer;
