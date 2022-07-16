import Wrapper from '../components/wrapper';
import { useNavigate } from 'react-router-dom';
const Login = () => {
	const navigate = useNavigate();
	return (<Wrapper setAuthenticated={(authenticated) => { if (authenticated) { navigate('/upload') } }}>
		<h1>Login</h1>
		<p>
			<a href='/api/auth/github'>Sign in With GitHub</a>
		</p>
	</Wrapper>
	)
};

export default Login;
