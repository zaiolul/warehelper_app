import {useState, Fragment} from "react"

import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import API from "../utils/ApiUrl"
import { getJwtToken } from "../utils/Auth";
import { Grid, Button, Box } from '@mui/material';
import { useNavigate } from "react-router-dom";

export default function RemoveCompanyDialog(props) {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
    
    async function removeCompany(){
        let companyId = props.company["id"];
        let url = API.URL + "/companies/" + companyId
        
      
        let response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + getJwtToken(),
                'Content-Type': 'application/json'
            },
        })
        .then(response => response.ok ? true : null)
        .catch(error => {
            console.log(error);
        });
        if(response == null){
            return;
        } else{
            
            

            localStorage.setItem("company", null);
            props.setCompany(null)
            navigate("/");
            handleClose();
            
            
        }
    }
    const handleSubmit = (e) => {
        e.preventDefault();
       removeCompany();
     
    };

    return (
        <Fragment>
               <Button
                    
                    onClick={handleClickOpen}
                    sx={{ mt: 3, mb: 1, width: 100, height: 50, color: "red" }}
                >
                    <b>Šalinti</b>
                </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle sx={{textAlign: "center"}}>Tikrai šalinti įmonę?</DialogTitle>
               
                <DialogActions sx ={{justifyContent:"center"}}>
                    <Button variant="contained" onClick={handleSubmit} sx={{color:"red"}}><b>Taip</b></Button>
                    <Button variant="contained" onClick={handleClose}><b>Atšaukti</b></Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}