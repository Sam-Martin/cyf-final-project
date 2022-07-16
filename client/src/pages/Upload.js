import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Wrapper from '../components/wrapper';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";
import Alert from '@mui/material/Alert';


import "./Home.css";

function fileChange(ev, setFile) {
    ev.preventDefault();
    console.log(ev.target.files[0])
    setFile(ev.target.files[0])
}



export function Upload() {
    const navigate = useNavigate();

    const [authenticated, setAuthenticated] = useState(0);
    const [errorMessage, setErrorMessage] = useState();
    const [imageUrl, setImageUrl] = useState();
    const [file, setFile] = useState();

    function uploadSuccess(res) {
        setErrorMessage('');
        const imageUrl = `http://localhost:3000/api/image/${res.imageId}`; 
        console.log(imageUrl);
        setImageUrl(imageUrl)
    }
    function uploadFailure(res) { setErrorMessage(res.error); console.log(res.error) }
    function handleUpload(ev, file) {
        const formData = new FormData();
        formData.append('pic1', file);
        fetch('api/upload', {
            method: 'POST',
            headers: {
                // 'Content-Type': 'multipart/form-data',
                'Accept': 'application/json'
            },
            body: formData
        }).then(res => res.json()).then(uploadSuccess).catch(uploadFailure)
    }
    if (authenticated === false) {
        navigate('/login')
    }
    if (!authenticated) {
        return <Wrapper setAuthenticated={setAuthenticated}></Wrapper>;
    }

    return (
        <Wrapper setAuthenticated={setAuthenticated}>
            <h1>{file ? file.name : "Upload Image"}</h1>
            <Alert severity="error" sx={{ display: errorMessage ? 'block' : 'none' }} >{errorMessage}</Alert>

            <form style={{ display: imageUrl ? 'none' : 'block' }} >
                <input type="file" onChange={(ev) => fileChange(ev, setFile)} />
                <Button variant="contained" onClick={(ev) => handleUpload(ev, file)}>Upload</Button>
            </form>
            <img src={imageUrl} style={{display: imageUrl ? 'block' : 'none'}}></img>
        </Wrapper>
    );
}

export default Upload;
