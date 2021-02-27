// import react libraries
import React from "react";

// import modules
import { render } from "react-dom";
import { Provider } from "react-redux";
import "@fontsource/roboto";
import "@fontsource/source-code-pro";

// import project files
import App from "./App";
import store from "./app/store";

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
