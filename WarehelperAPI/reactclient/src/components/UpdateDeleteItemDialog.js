import { useState, Fragment } from "react"
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import API from "../utils/ApiUrl"
import { getJwtToken } from "../utils/Auth";
import getCompany from "../utils/GetCompany";
import AddIcon from '@mui/icons-material/Add';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { InputLabel } from "@mui/material";
import { red } from "@mui/material/colors";

export default function UpdateDeleteItemDialog({open, setOpen, company, warehouse, item, getWarehouses, setSelected, getItems, test}) {

    const [formData, setFormData] = useState({
        description: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    async function itemUpdate() {
        let url = API.URL + "/companies/" + company["id"] + "/warehouses/" + warehouse["id"] + "/items/" + item["id"];
       

        let response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + getJwtToken(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                description: formData.description,
            })
        })
            .then(response => response.ok ? response.json() : null)
            .catch(error => {
                console.log(error);
            });
        if (response == null) {
            return;
        } else {
        
        }
        
    }

    async function itemDelete() {
        let url = API.URL + "/companies/" + company["id"] + "/warehouses/" + warehouse["id"] + "/items/" + item["id"];
       

        let response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + getJwtToken(),
                'Content-Type': 'application/json'
            }
        })
        .catch(error => {
            console.log(error);
        });
      
        
    }
    function handleShared(){
        setFormData({
            description: "",
        })
        setOpen(false);
        for(let i = 0; i < 5; i ++){
                getWarehouses();
                getItems();
        }
        setSelected(warehouse)
        test()
    }
    const handleSubmitDel = (e) => {
        e.preventDefault();
        itemDelete();
        handleShared()
      
    };
    const handleSubmitUp = (e) => {
        e.preventDefault();
        itemUpdate();
        handleShared()
    };
    const menuItems = 
    [   "Elektronika",
    "Biuro įranga",
    "Baldai",
    "Maisto prekės",
    "Drabužiai",
    "Kita"].map((x, index)=>{
            return(
                <MenuItem key={index} value={x}>{x}</MenuItem>
            )
        })

    return (
        <Fragment>
            <Dialog open={open} onClose={()=> setOpen(false)}>
                <DialogTitle sx={{ textAlign: "center" }}>Daikto informacija</DialogTitle>
                <DialogContent>

                    <TextField
                        autoFocus
                       
                        margin="dense"
                        id="description"
                        name="description"
                        label="Aprašymas"
                        type="text"
                        fullWidth
                        variant="standard"
                        
                        onChange={handleChange}
                    />
                 

                </DialogContent>
                <DialogActions sx={{ justifyContent: "center" }}>
                    <Button sx={{color:'inherit'}} onClick={handleSubmitUp} ><b>Atnaujinti</b></Button>
                    <Button sx={{color:'red'}} onClick={handleSubmitDel} ><b>Šalinti</b></Button>
                    <Button sx={{color:'inherit'}} onClick={()=> setOpen(false)}><b>Atšaukti</b></Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}