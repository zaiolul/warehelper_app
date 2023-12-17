import React from "react"
import { useState, useEffect } from "react"
import { Container } from "@mui/material"
import Typography from '@mui/material/Typography';
import { Grid, Button, Box } from '@mui/material';
import {getRole, getName} from "../utils/Auth"
import CreateCompanyDialog from "../components/CreateCompanyDialog"
import API from "../utils/ApiUrl";
export default function Front({company, setCompany, getCompany}) {
    // const [company, setCompany] = useState({});
   
    function displayCompanyInfo(){
        
        return(
        <div>
        <Typography
            variant="h6"
            sx={{
                fontFamily: 'inherit',
                fontWeight: 500,
                fontSize: 30,
                
                textAlign: 'center'
            }}
        >
            Sveiki prisijungę prie <i><b>{company["name"]}</b></i> inventoriaus sekimo sistemos.<br/> 
            
        </Typography>
      
        </div>
        );
    }
  
    
    function adminFront() {
        return(
        <div>
            <Typography
                variant="h6"
                sx={{
                    fontFamily: 'inherit',
                    fontWeight: 700,
                    fontSize: 30,
                    letterSpacing: '.1rem',
                    textAlign: 'center'
                }}
            >
                Įmonė dar neregistruota. Spauskite žemiau esantį mygtuką ir sukurkite įmonę.
            </Typography>
            <CreateCompanyDialog setCompany={setCompany}/>
            
        </div>
        )
    }
    

    function workerFront() {
    
        return(
            <Typography
                variant="h6"
                sx={{
                    fontFamily: 'inherit',
                    fontWeight: 700,
                    fontSize: 30,
                    letterSpacing: '.1em',
                    textAlign: 'center'
                }}
            >
                Jūs nesate priskirtas jokiai įmonei. Susisiekite su įmonės administracija.
            </Typography>
        )
    }
    useEffect(()=> {
        getCompany()
        },[]) // empty array means it only run once
    
    return (
        <Grid  container justifyContent="flex" alignItems="center" direction="column" sx={{ minHeight: '100vh' }}>
            <Box sx={{mt: 20, textAlign: "center"}}>

            {company == "null" || company== null  ? (getRole() === "Admin" && adminFront()) || workerFront() : displayCompanyInfo()}
          
            </Box>
            
        </Grid>
    )
}