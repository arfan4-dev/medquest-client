import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App.jsx";
import "./index.css";
import store from "./store/index.js";
import { DrawerProvider } from "./context/drawer/index.jsx";
import { ModalProvider } from "./context/modal/index.jsx";
import ToasterComponent from "./components/ToasterComponent.jsx";
createRoot(document.getElementById("root")).render(
  <DrawerProvider>
    <Provider store={store}>
      <ToasterComponent />
      <ModalProvider>
        <App />
      </ModalProvider>
    </Provider>
  </DrawerProvider>
);
