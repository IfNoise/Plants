import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App";
import { store } from "./store/store";
import { DeviceStatusProvider } from "./context/DeviceStatusContext";
import { ChannelsProvider } from "./context/ChannelsContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <DeviceStatusProvider>
      <ChannelsProvider>
        <App />
      </ChannelsProvider>
    </DeviceStatusProvider>
  </Provider>,
);
