import React from "react"

import TopBar from "../components/Navbar"
import { getJwtToken } from "../utils/Auth"
import { Container, Grid, Box } from "@mui/material"
import UpdateCompanyDialog from "../components/UpdateCompanyDialog"
import RemoveCompanyDialog from "../components/RemoveCompanyDialog"
import Typography from '@mui/material/Typography';
import { useState } from "react"
import { useNavigate } from "react-router-dom"
export default function Company({company, setCompany}) {
    
    const navigate = useNavigate();
    if(!company){
       
        return;
    }
    
    function printCompanyData() {
        if(!company)
            return
        return (
            <div>
                <Typography
                    variant="h6"
                    sx={{
                        fontFamily: 'inherit',
                        fontWeight: 700,
                        fontSize: 30,
                        mt: 5,
                        textAlign: 'center'
                    }}
                >
               {company["name"]}
                </Typography>
                <Typography
                    variant="h6"
                    sx={{
                        fontFamily: 'inherit',
                        fontWeight: 500,
                        fontSize: 20,
                        mt: 5,
                        textAlign: 'center'
                    }}
                >

                    <b>Adresas:</b> {company["address"]} <br />
                    <b>Įmonė registruota sistemoje:</b> {(new Date(company["registrationDate"])).toISOString().split('T')[0]}

                </Typography>
            </div>
        );
    }
    return (
        <Grid container justifyContent="flex-center" alignItems="center" direction="column" sx={{ minHeight: '100vh' }}>
            <Box sx={{ mt: 10, textAlign: "center" }}>
                {printCompanyData()}
                <UpdateCompanyDialog setCompany={setCompany} company={company}></UpdateCompanyDialog>
                 <RemoveCompanyDialog setCompany={setCompany} company={company}></RemoveCompanyDialog>
            </Box>
        </Grid>
    )
}