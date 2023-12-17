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
export default function CreateWarehouseDialog({company, getWarehouses}) {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    const [formData, setFormData] = useState({
        name: "",
        address: "",
        type: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    async function createWarehouse() {
        let url = API.URL + "/companies/" + company["id"] + "/warehouses";
        // console.log(JSON.stringify({
        //     name: formData.name,
        //     address: formData.address,
        //     type: formData.type}))

        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + getJwtToken(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: formData.name,
                address: formData.address,
                type: formData.type
            })
        })
            .then(response => response.ok ? response.json() : null)
            .catch(error => {
                console.log(error);
            });
        if (response == null) {
            return;
        } else {
            for(let i = 0; i < 5; i ++)
                getWarehouses();
            handleClose();
        }
        
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        setFormData({
            name: "",
            address: "",
            type: ""
        })
        createWarehouse()
        // for( let i = 0; i < 10; i ++){
        //     getWarehouses()
        // }
    };
    const menuItems = 
    [   "Produkcija",
        "Žaliavos",
        "Paskirstymo centras",
        "Kita"].map((x)=>{
            return(
                <MenuItem value={x}>{x}</MenuItem>
            )
        })

    return (
        <Fragment>

            <Button

                onClick={handleClickOpen}
                sx={{ mt: 3, mb: 2, width: 200, height: 50, fontFamily: "inherit", color: "inherit" }}
            >
                <AddIcon></AddIcon>
                Pridėti naują sandėlį
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle sx={{ textAlign: "center" }}>Sandėlio informacija</DialogTitle>
                <DialogContent>

                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="name"
                        name="name"
                        label="Pavadinimas"
                        type="text"
                        fullWidth
                    
                        variant="standard"
                        onChange={handleChange}
                    />
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="address"
                        name="address"
                        label="Adresas"
                        type="text"
                        fullWidth
                        variant="standard"
                        
                        onChange={handleChange}
                    />
                   <InputLabel id="type">Tipas</InputLabel>
                    <Select
                        required
                        id="type"   
                        margin="dense"                
                        fullWidth
                        name="type"
                        onChange={handleChange}
                    >
                        {menuItems}
                    </Select>
                    
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center" }}>
                    <Button variant="contained" onClick={handleSubmit}><b>Sukurti</b></Button>
                    <Button variant="contained" onClick={handleClose}><b>Atšaukti</b></Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}