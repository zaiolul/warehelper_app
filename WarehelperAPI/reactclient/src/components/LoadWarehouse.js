import React, { useState, useEffect } from "react"
import Typography from '@mui/material/Typography';
import { Container, Grid, Box, Paper } from "@mui/material"
import Button from '@mui/material/Button';

import { experimentalStyled as styled } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getRole } from "../utils/Auth";
import CreateItemDialog from "./CreateItemDialog";
import UpdateDeleteItemDialog from "./UpdateDeleteItemDialog";

import UpdateWarehouseDialog from "./UpdateWarehouseDialog";
import RemoveWarehouseDialog from "./RemoveWarehouseDialog";
import API from "../utils/ApiUrl";
export default function LoadWarehouse({ company, warehouse, setSelected, setToRemove, getWarehouses }) {
    const [selectedItem, setSelectedItem] = useState(null);

    const [open, setOpen] = useState(false);

    


    const [items, setItems] = useState(null);
    const [_, _test] = useState(false); // lord forgive me

    function test(){
        _test(!_);
    }
    const Item = styled(Paper)(({ theme }) => ({
        padding: theme.spacing(2),
        textAlign: 'center',
        width: 200,
        height: 125,
        color: theme.palette.text.primary,
        transition: 'transform 0.1s ease-in-out',
        '&:hover': {
            transform: 'scale(1.1)',
            cursor: 'pointer'
        },

    }));

    async function getItems() {
        if (!company)
            return
        let url = API.URL + "/companies/" + company["id"] + "/warehouses/" + warehouse["id"] + "/items";
        // console.log(url)

        let response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(response => {

                return response.ok ? response.json() : null;
            })
            .catch(error => {
                console.log(error);
            });

        if (response == null) {

        } else {
            // console.log(response)
            setItems(response);
        }
    }
    useEffect(() => {
        getItems();

    }, []);
    return (
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
                {warehouse["name"]}

            </Typography>
            <Typography
                variant="h6"
                sx={{
                    fontFamily: 'inherit',
                    fontWeight: 500,
                    fontSize: 20,

                    textAlign: 'center'
                }}
            >
                Adresas: {warehouse["address"]};   Tipas:  {warehouse["type"]}

            </Typography>




            <Container sx={{ maxWidth: "80%", }}>
                <Button
                    onClick={() => setSelected(null)}
                    sx={{ mt: 3, mb: 2, width: 200, height: 50, fontFamily: "inherit", color: "inherit" }}
                >
                    <ArrowBackIcon></ArrowBackIcon> Atgal
                </Button>
                {getRole() == "Admin" && <UpdateWarehouseDialog getWarehouses={getWarehouses} company={company} warehouse={warehouse} setSelected={setSelected}></UpdateWarehouseDialog>}
                {getRole() == "Admin" && <RemoveWarehouseDialog setToRemove={setToRemove} company={company} warehouse={warehouse} setSelected={setSelected}></RemoveWarehouseDialog>}
                <CreateItemDialog company={company} warehouse={warehouse} getWarehouses={getWarehouses} setSelected={setSelected} getItems={getItems} test={test}></CreateItemDialog>
                <UpdateDeleteItemDialog open={open} setOpen={setOpen} company={company} warehouse={warehouse} getWarehouses={getWarehouses} setSelected={setSelected} getItems={getItems} test={test} item={selectedItem}></UpdateDeleteItemDialog>
         
                <Grid container spacing={2} alignItems="center" justifyContent="flex-center" sx={{ mt: 2}}>

                    {items && items.map((item) => (
                        <Grid key={item["id"]} item sm={12} md={6} lg={3}>
                            <Item onClick={() =>  {setOpen(true); setSelectedItem(item)}} >

                    
                            <Typography sx={{wordBreak: "break-word", fontFamily: 'inherit', textAlign: 'center',}}> <b>{item["name"]}</b>  </Typography>
                            <Typography sx={{ wordBreak: "break-word", fontFamily: 'inherit', textAlign: 'center', mb: 5, fontStyle: "italic", fontSize:15 }}> {item["description"]}  </Typography>

                            </Item>

                        </Grid>
                    ))}


                </Grid>
            </Container>
        </div>
    );
}