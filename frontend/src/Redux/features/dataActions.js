import axios from "axios";
import { createAsyncThunk, createAction } from "@reduxjs/toolkit";

const url = "http://localhost:5000";

export const CreateNewProject = createAsyncThunk(
  "data/createProject",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url}/project/create`, data);
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const GetMyProjects = createAsyncThunk(
  "data/getMyProjects",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/project/userProjects`, data);
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const GetOneProject = createAsyncThunk(
  "data/getOneProject",
  async (_id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/project/getOne/${_id}`);
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const DeleteProject = createAsyncThunk(
  "data/deleteProject",
  async (_id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${url}/project/delete/${_id}`);
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const GetUnreadNotifications = createAsyncThunk(
  "data/getUnreadNotifications",
  async (_id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/notification/unreadNotifications/${_id}`);
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const GetAllNotifications = createAsyncThunk(
  "data/getAllNotifications",
  async (_id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/notification/allNotifications/${_id}`);
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
)

export const ReadNotification = createAsyncThunk(
  "data/readNotification",
  async (_id, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${url}/notification/readNotification/${_id}`);
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
)

export const DeleteNotification = createAsyncThunk(
  "data/deleteNotification",
  async (_id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${url}/notification/deleteNotification/${_id}`);
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
)

export const AcceptInvitation = createAsyncThunk(
  "data/acceptInvitation",
  async (_id, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${url}/project/acceptInvitation`);
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
)

export const InviteUsers = createAsyncThunk(
  "data/inviteUsers",
  async (_id, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${url}/project/${_id}/inviteUsers`);
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
)


// Old Project Functions

export const FetchAllDepartments = createAsyncThunk(
  "data/fetchAllDepartments",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/departments/`, data);
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const FetchTeacher = createAsyncThunk(
  "data/fetchTeacher",
  async (_id, { rejectWithValue }) => {
    try {
      // console.log("what about here");
      const response = await axios.get(`${url}/teachers/${_id}`);
      console.log(response, "response from redux");
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const FetchStudent = createAsyncThunk(
  "data/fetchStudent",
  async (_id, { rejectWithValue }) => {
    try {
      // console.log(id, "what about here");
      const response = await axios.get(`${url}/students/${_id}`);
      console.log(response, "response from redux");
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const FetchAdmin = createAsyncThunk(
  "data/fetchAdmin",
  async (_id, { rejectWithValue }) => {
    try {
      console.log("what about here", _id);
      const response = await axios.get(`${url}/admins/${_id}`);
      console.log(response, "response from redux");
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const UpdateAdmin = createAsyncThunk(
  "data/updateAdmin",
  async (data, { rejectWithValue }) => {
    const {_id} = data
    try {
      const response = await axios.patch(`${url}/admins/${_id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const UpdateTeacher = createAsyncThunk(
  "data/updateTeacher",
  async (data, { rejectWithValue }) => {
    const {_id} = data
  try {
      const response = await axios.patch(`${url}/teachers/${_id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const UpdateStudent = createAsyncThunk(
  "data/updateStudent",
  async (data, { rejectWithValue }) => {
    const {_id} = data
    try {
      const response = await axios.patch(`${url}/students/${_id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const FetchAllTeachers = createAsyncThunk(
  "data/fetchAllTeachers",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/teachers/`);
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
)

export const FetchAllStudents = createAsyncThunk(
  "data/fetchAllStudents",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/students/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const FetchAllAdmins = createAsyncThunk(
  "data/fetchAllAdmins",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/admins/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const FetchAllCourses = createAsyncThunk(
  "data/fetchAllCourses",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/courses/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const FetchCourse = createAsyncThunk(
  "data/fetchCourse", 
  async (data, { rejectWithValue }) => {
    const {_id} = data
    try {
      const response = await axios.get(`${url}/courses/${_id}`);
      console.log(response);
      return response.data.course
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
)

export const FetchLogs = createAsyncThunk(
  "data/fetchLogs",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/logs/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
)

export const ExportDataLocal = createAsyncThunk(
  "data/exportDataLocal",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/data-backup/export-data`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
)
