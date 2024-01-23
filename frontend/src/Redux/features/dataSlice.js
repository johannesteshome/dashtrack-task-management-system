import { createSlice } from "@reduxjs/toolkit";
import { FetchAllDepartments, FetchStudent, FetchTeacher, FetchAdmin, UpdateAdmin, UpdateStudent, UpdateTeacher, FetchCourse, FetchAllAdmins, FetchAllStudents, FetchAllTeachers, FetchAllCourses, FetchLogs, ExportDataLocal } from "./dataActions";

const initialState = {
  departments: null,
  loading: false,
  loggedInUser: null,
  students: null,
  teachers: null,
  admins: null,
  courses: null,
  attendances: null,
  logs: null
};

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(FetchAllDepartments.pending, (state) => {
        state.loading = true;
      })
      .addCase(FetchAllDepartments.fulfilled, (state, action) => {
        console.log(action, "slice");
        state.loading = false;
        state.departments = action.payload;
      })
      .addCase(FetchAllDepartments.rejected, (state) => {
        state.loading = false;
      })
      .addCase(FetchAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(FetchAdmin.fulfilled, (state, action) => {
        console.log(action, "slice");
        state.loading = false;
        state.loggedInUser = action.payload;
      })
      .addCase(FetchAdmin.rejected, (state) => {
        state.loading = false;
      })
      .addCase(FetchStudent.pending, (state) => {
        state.loading = true;
      })
      .addCase(FetchStudent.fulfilled, (state, action) => {
        console.log(action, "slice");
        state.loading = false;
        state.loggedInUser = action.payload;
      })
      .addCase(FetchStudent.rejected, (state) => {
        state.loading = false;
      })
      .addCase(FetchTeacher.pending, (state) => {
        state.loading = true;
      })
      .addCase(FetchTeacher.fulfilled, (state, action) => {
        console.log(action, "slice");
        state.loading = false;
        state.loggedInUser = action.payload;
      })
      .addCase(FetchTeacher.rejected, (state) => {
        state.loading = false;
      })
      .addCase(UpdateAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(UpdateAdmin.fulfilled, (state, action) => {
        console.log(action, "slice");
        state.loading = false;
      })
      .addCase(UpdateAdmin.rejected, (state) => {
        state.loading = false;
      })
      .addCase(UpdateStudent.pending, (state) => {
        state.loading = true;
      })
      .addCase(UpdateStudent.fulfilled, (state, action) => {
        console.log(action, "slice");
        state.loading = false;
      })
      .addCase(UpdateStudent.rejected, (state) => {
        state.loading = false;
      })
      .addCase(UpdateTeacher.pending, (state) => {
        state.loading = true;
      })
      .addCase(UpdateTeacher.fulfilled, (state, action) => {
        console.log(action, "slice");
        state.loading = false;
      })
      .addCase(UpdateTeacher.rejected, (state) => {
        state.loading = false;
      })
      .addCase(FetchCourse.pending, (state) => {
        state.loading = true;
      })
      .addCase(FetchCourse.fulfilled, (state, action) => {
        console.log(action, "slice");
        state.loading = false;
      })
      .addCase(FetchCourse.rejected, (state) => {
        state.loading = false;
      })
      .addCase(FetchAllAdmins.pending, (state) => {
        state.loading = true;
      })
      .addCase(FetchAllAdmins.fulfilled, (state, action) => {
        console.log(action, "slice");
        state.loading = false;
        state.admins = action.payload;
      })
      .addCase(FetchAllAdmins.rejected, (state) => {
        state.loading = false;
      })
      .addCase(FetchAllStudents.pending, (state) => {
        state.loading = true;
      })
      .addCase(FetchAllStudents.fulfilled, (state, action) => {
        console.log(action, "slice");
        state.loading = false;
        state.students = action.payload;
      })
      .addCase(FetchAllStudents.rejected, (state) => {
        state.loading = false;
      })
      .addCase(FetchAllTeachers.pending, (state) => {
        state.loading = true;
      })
      .addCase(FetchAllTeachers.fulfilled, (state, action) => {
        console.log(action, "slice");
        state.loading = false;
        state.teachers = action.payload;
      })
      .addCase(FetchAllTeachers.rejected, (state) => {
        state.loading = false;
      })
      .addCase(FetchAllCourses.pending, (state) => {
        state.loading = true;
      })
      .addCase(FetchAllCourses.fulfilled, (state, action) => {
        console.log(action, "slice");
        state.loading = false;
        state.courses = action.payload.courses;
      })
      .addCase(FetchAllCourses.rejected, (state) => {
        state.loading = false;
      })
      .addCase(FetchLogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(FetchLogs.fulfilled, (state, action) => {
        console.log(action, "slice");
        state.loading = false;
        state.logs = action.payload.logs;
      })
      .addCase(FetchLogs.rejected, (state) => {
        state.loading = false;
      })
      .addCase(ExportDataLocal.pending, (state) => {
        state.loading = true;
      })
      .addCase(ExportDataLocal.fulfilled, (state, action) => {
        console.log(action, "slice");
        state.loading = false;
      })
      .addCase(ExportDataLocal.rejected, (state) => {
        state.loading = false;
      });
  }
});

export const {} = dataSlice.actions;

export default dataSlice.reducer;
