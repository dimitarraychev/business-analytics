import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import ReportContextProvider from "./context/ReportContext.tsx";
import { ConfigProvider } from "./context/ConfigContext.tsx";

createRoot(document.getElementById("root")!).render(
  <ConfigProvider>
    <ReportContextProvider>
      <App />
    </ReportContextProvider>
  </ConfigProvider>,
);
