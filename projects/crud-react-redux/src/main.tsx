import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { Provider } from "react-redux";
import { store } from "./store/index.ts";

createRoot(document.getElementById("root")!).render(
	<Provider store={store}>
		{/* <Provider> es un componente proporcionado por la biblioteca react-redux, que se utiliza para conectar una aplicación React con un Redux store */}
		{/* permite que desde cualquier parte de la aplicacion podamos leer la store y mandar acciones a la store, para que genere nuevos estados  */}
		<App />
	</Provider>,
);
