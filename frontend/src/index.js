import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import {store} from "./Redux/store";
import axios from "axios";
import { ConfigProvider } from "antd";
import { persistor } from "./Redux/store";
import { PersistGate } from "redux-persist/integration/react";
import LoadingScreen from "./Screens/LoadingScreen";

axios.defaults.withCredentials = true;
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ConfigProvider
    theme={{
      theme: {
        primaryColor: "#1890ff",
        primaryColorHover: "#1890ff",
        primaryColorPressed: "#1890ff",
        primaryColorSuppl: "#1890ff",
      },
    }}>
    <BrowserRouter>
      <Provider store={store}>
        <PersistGate
          loading={<LoadingScreen/>}
          persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    </BrowserRouter>
  </ConfigProvider>
);
