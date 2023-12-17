import React, { useState } from 'react'
import API from "../utils/ApiUrl.js"
import { getJwtToken, setJwtToken, setRefreshToken } from "../utils/Auth.js";
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { TextField, Grid, Button, Box } from '@mui/material';
import { Link, Navigate, useNavigate} from 'react-router-dom';

export default function LoginForm(props) {

    const [user, setUser] = useState(null)
    const navigate = useNavigate();

    const initialData = Object.freeze({
        userName: "",
        password: ""
    });
    const [formData, setFormData] = useState(initialData);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        localStorage.clear()
        sessionStorage.clear()
        doLogin();
      
       
    };


    async function doLogin() {
        
        let creds = {
            userName: formData.userName,
            password: formData.password
        };
        let assigned = {};
        let url = API.URL + "/login";
        
        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(creds)
        })
        .then(response => response.ok ? response.json() : null)
        .catch(error => {
            console.log(error);
        });
        if(response == null){
            // console.log(response);
            setUser(null);
            return;
        } else{
            // console.log(response)
            setJwtToken(response.accessToken);
            setRefreshToken(response.refreshToken);
            assigned = {
                company: response["company"],
                warehouse: response["warehouse"]
            }
            // console.log(assigned)
            
            localStorage.setItem("assigned", JSON.stringify(assigned));
            props.getCompany().then((res) =>  { props.setCompany(res);});
           
          
            props.setUser(assigned);
            navigate("/");
           
    
        }

     
    }
    return (
        <Container maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >

                <Typography component="h1" variant="h5">
                    Prisijungti
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="userName"
                        label="Vartotojo vardas"
                        name="userName"
                        autoFocus
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Slaptažodis"
                        type="password"
                        id="password"
                        onChange={handleChange}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        
                    >
                        Prisijungti

                    </Button>
               
                </Box>
            </Box>
        </Container>


    );


}