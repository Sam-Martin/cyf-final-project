import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';


import Box from '@mui/material/Box';
const theme = createTheme();


function Wrapper({children, setAuthenticated}) {
    

	useEffect(() => {
		fetch("/api/auth/validate")
			.then((res) => {
				if (!res.ok) {
					throw new Error(res.statusText);
				}
				return res.json();
			})
			.then((body) => {
				setAuthenticated(body.authenticated);
			})
			.catch((err) => {
				console.error(err);
			});
	}, []);
    return (<ThemeProvider theme={theme}>
        <CssBaseline />

        <Container component="main">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                {children}
            </Box>
        </Container>
    </ThemeProvider>);
}
export default Wrapper