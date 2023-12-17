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
export default function CreateCompanyDialog({ company, setCompany }) {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    const [formData, setFormData] = useState({
        name: "",
        address: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    async function createCompany() {
        let url = API.URL + "/companies";
        // console.log(formData);

        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + getJwtToken(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: formData.name,
                address: formData.address
            })
        })
            .then(response => response.ok ? response.json() : null)
            .catch(error => {
                console.log(error);
            });
        if (response == null) {


            return;
        } else {
            if (localStorage.getItem("assigned")) {
                let assigned = JSON.parse(localStorage.getItem("assigned"))
                assigned.company = response["id"]
                localStorage.setItem("assigned", JSON.stringify(assigned))
                console.log(localStorage.getItem("assigned"))
            }

            setCompany(response);
            handleClose();

        }
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        createCompany();


    };

    return (
        <Fragment>
            <Button
                variant="contained"
                onClick={handleClickOpen}
                sx={{ mt: 3, mb: 2, width: 200, height: 50 }}
            >
                <b>Sukurti įmonę</b>
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle sx={{ textAlign: "center" }}>Įmonės informacija</DialogTitle>
                <DialogContent>

                    <TextField
                        autoFocus
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
                        margin="dense"
                        id="address"
                        name="address"
                        label="Adresas"
                        type="text"
                        fullWidth
                        variant="standard"
                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center" }}>
                    <Button variant="contained" onClick={handleSubmit}><b>Sukurti</b></Button>
                    <Button variant="contained" onClick={handleClose}><b>Atšaukti</b></Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}