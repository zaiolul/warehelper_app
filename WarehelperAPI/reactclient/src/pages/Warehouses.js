import React from "react"
import Typography from '@mui/material/Typography';
import { Container, Grid, Box, Button, Paper } from "@mui/material"
import { experimentalStyled as styled } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../utils/ApiUrl";
import CreateWarehouseDialog from "../components/CreateWarehouseDialog";
import UpdateWarehouseDialog from "../components/UpdateWarehouseDialog";
import { getRole } from "../utils/Auth";
import RemoveWarehouseDialog from "../components/RemoveWarehouseDialog";
import LoadWarehouse from "../components/LoadWarehouse";
export default function Warehouses({ company }) {

    const navigate = useNavigate();

    const [warehouses, setWarehouses] = useState(null);
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    
    function setToRemove(val){
        setWarehouses(warehouses.filter((wh) => wh != val));
    }
    function setToUpdate(val){
        setWarehouses(warehouses.foreach((wh) => wh == val ? wh =val : wh = wh));
    }
  
    function pushWarehouses(val){
        if(!warehouses)
            return;
        let tmp = warehouses;
        tmp.push(val);
        setWarehouses(tmp)
    }
    
    async function getWarehouses() {
        if(!company)
            return
        let url = API.URL + "/companies/" + company["id"] + "/warehouses";
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
            console.log(response)
            setWarehouses(response);
        }
    }
    useEffect(() => {
    
        getWarehouses();
    
    }, []);

    const Item = styled(Paper)(({ theme }) => ({
        padding: theme.spacing(2),
        textAlign: 'center',
        width: 200,
        height: 200,
        color: theme.palette.text.primary,
        transition: 'transform 0.1s ease-in-out',
        '&:hover': {
            transform: 'scale(1.1)',
            cursor: 'pointer'
        },
       
    }));


    return (
        <div>

            <Container sx={{ maxWidth: "80%", mt: 10 }}>

                {!selected && getRole() == "Admin" && <CreateWarehouseDialog company={company} warehouses={warehouses} getWarehouses={getWarehouses}></CreateWarehouseDialog>}
                <Grid container spacing={2} alignItems="center" justifyContent="flex-center" sx={{ mt: 2 }}>
               
                    {!selected && warehouses && warehouses.map((warehouse) => (
                        <Grid key={warehouse["id"]} item xs={12} sm={6} md={4} lg={3}>
                            <Item onClick={() => setSelected(warehouse)}>
                          
                                <Typography sx={{wordBreak: "break-word", fontFamily: 'inherit', textAlign: 'center', mb: 5}}> <b>{warehouse["name"]}</b>  </Typography>
                                <Typography sx={{ wordBreak: "break-word", fontFamily: 'inherit', textAlign: 'center', mb: 5 }}>  Kiekis: {warehouse["itemCount"]}  </Typography>
                            
                                {/* <UpdateWarehouseDialog warehouse={warehouse} company={company} getWarehouses={getWarehouses}></UpdateWarehouseDialog> */}
                            </Item>
                            

                        </Grid>
                    ))}
                    

                </Grid>
            </Container>
            {selected  && <LoadWarehouse getWarehouses={getWarehouses} setToUpdate={setToUpdate} setToRemove={setToRemove} company={company} setSelected={setSelected} warehouse={selected}></LoadWarehouse>}
        </div>
    );
}