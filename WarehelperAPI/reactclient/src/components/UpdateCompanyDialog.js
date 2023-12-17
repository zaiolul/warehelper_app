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

export default function UpdateCompanyDialog(props) {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
   
    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

 
    const [formData, setFormData] = useState({
        // name: props.company["name"],
        address: props.company["address"]
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    
    async function updateCompany(){
        let companyId = props.company["id"];
        let url = API.URL + "/companies/" + companyId
        
      
        let response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + getJwtToken(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                // name: formData.name,
                address: formData.address
            })
        })
        .then(response => response.ok ? response.json() : null)
        .catch(error => {
            console.log(error);
        });
        if(response == null){
            return;
        } else{

            let company = response;
            console.log(response);
            props.setCompany(company);
            company = company == undefined ? null : company;
           
            handleClose();
           
        }
    }
    const handleSubmit = (e) => {
        e.preventDefault();
       updateCompany();
       
    };

    return (
        <Fragment>
           
            <Button
                variant="contained"
                onClick={handleClickOpen}
                sx={{ mt: 3, mb: 1, mr: 3, width: 200, height: 50 }}
            >
                <b>Atnaujinti</b>
            </Button>
           
          
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle sx={{textAlign: "center"}}>Atnaujinti įmonės adresą</DialogTitle>
                <DialogContent>
                   
                    {/* <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        name="name"
                        label="Pavadinimas"
                        type="text"
                        fullWidth
                        variant="standard"
                        onChange={handleChange}
                    /> */}
                      <TextField
                        autoFocus
                        margin="dense"
                        id="address"
                        name="address"
                        label="Adresas"
                        type="text"
                        fullWidth
                        variant="standard"
                        // value={props.company["address"]}
                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions sx ={{justifyContent:"center"}}>
                    <Button variant="contained" onClick={handleSubmit}><b>Atnaujinti</b></Button>
                    <Button variant="contained" onClick={handleClose}><b>Atšaukti</b></Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}