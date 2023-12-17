import React from "react"
import { Container, Grid, Box } from "@mui/material"
import LoginForm from "../components/LoginForm"
import { getJwtToken, setRefreshToken, setJwtToken, tokenValid } from "../utils/Auth"
import {Navigate, useNavigate} from "react-router-dom"
import AllInboxIcon from '@mui/icons-material/AllInbox'
import Typography from "@mui/material/Typography"
import { useEffect } from "react"
import UpdateWarehouseDialog from "../components/UpdateWarehouseDialog"
import RemoveCompanyDialog from "../components/RemoveCompanyDialog"
import getCompany from "../utils/GetCompany"

export const Login = (props)=>{
    function checkIfAuth(){
        // console.log("RELOAD LOGIN")
        if(tokenValid()){
            
            localStorage.clear()
            sessionStorage.clear()
        }
        // console.log("after " + getJwtToken())
       
    }
   
    
    return(
       
       <Grid container justifyContent="center" alignItems="center" direction="column" sx={{ minHeight: '100vh' }}> 
            {checkIfAuth()}
             <AllInboxIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} /> 
                     <Typography
                        variant="h6"
                        sx={{
                            fontFamily: 'inherit',
                            fontWeight: 700,
                            fontSize:50,
                            letterSpacing: '.5rem',
                            textAlign: 'center'
                        }} 
                     > 
                        Warehelper
                     </Typography>
                <LoginForm {...props}/> 
              
            
            
        </Grid>
    )
}