import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Wrapper from '../components/wrapper';

import GitHubIcon from '@mui/icons-material/GitHub';

import "./Home.css";


export function Home() {
	const [authenticated, setAuthenticated] = useState();

	return (
		<Wrapper setAuthenticated={setAuthenticated}>
			<a href="login"><h1><GitHubIcon fontSize="large"/> Login</h1></a>
		</Wrapper>
	);
}

export default Home;
