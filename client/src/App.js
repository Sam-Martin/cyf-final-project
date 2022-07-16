import { Route, Routes } from "react-router-dom";

import About from "./pages/About";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Upload from "./pages/Upload"

const App = () => (
	<Routes>
		<Route path="/" element={<Home />} />
		<Route path="/login" element={<Login />} />
		<Route path="/upload" element={<Upload />} />
		<Route path="/about/this/site" element={<About />} />
	</Routes>
);

export default App;
