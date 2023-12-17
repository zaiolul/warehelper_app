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

export default function RemoveWarehouseDialog({company, warehouse, setSelected, setToRemove}) {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
    
    async function removeWarehouse(){
        let companyId = company["id"];
        let warehouseId = warehouse["id"]
        let url = API.URL + "/companies/" + companyId + "/warehouses/" + warehouseId
        
        // console.log("SAlinti: " + url)
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
            
            
           
           
            handleClose();
            setSelected(null);
            setToRemove(warehouse);
           
            
        }
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        removeWarehouse();
        for( let i = 0; i < 10; i ++){ //how tf do i update display on request complete???
           // getWarehouses()
        }
     
    };

    return (
        <Fragment>
               <Button
                    
                    onClick={handleClickOpen}
                    sx={{ mt: 3, mb: 2, width: 200, height: 50, fontFamily: "inherit", color: "red" }}
                >
                    Šalinti
                </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle sx={{textAlign: "center"}}>Tikrai šalinti sandėlį?</DialogTitle>
               
                <DialogActions sx ={{justifyContent:"center"}}>
                    <Button variant="contained" onClick={handleSubmit} sx={{color:"red"}}><b>Taip</b></Button>
                    <Button variant="contained" onClick={handleClose}><b>Atšaukti</b></Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}