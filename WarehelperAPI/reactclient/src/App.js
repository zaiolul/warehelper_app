import React, { useState, useEffect } from "react";
import './App.css';
import URL from "./utils/ApiUrl";
import { getRoles, tokenValid } from "./utils/Auth";

import TopBar from "./components/Navbar";
import { ThemeProvider, createTheme, useTheme } from '@mui/material/styles';
import { CustomThemePalette } from "./utils/Theme";
import Container from '@mui/material/Container';
import { CssBaseline } from "@mui/material";

import { Login } from "./pages/Login"
import Company from "./pages/Company"
import Warehouses from "./pages/Warehouses"
import LoginForm from './components/LoginForm';
import Front from "./pages/Front.js";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import IconButton from '@mui/material/IconButton';
import PrivateRoute, { Anonymous, Protected } from "./utils/AuthRoutes.js";
import getCompany from "./utils/GetCompany.js";
const API_LOCAL = "http://localhost:58780/api";
const API_REMOTE = "https://warehelper.azurewebsites.net";





export default function App() {

  const [user, _setUser] = useState(true);
  const [company, setCompany] = useState(null);
  const [warehouses, setWarehouses ]= useState(null);

  function setUser(){
    _setUser(!user)
  }

  const [mode, setMode] = useState('light');
  const theme = createTheme(CustomThemePalette(mode));

  // console.log("TEST" + localStorage.getItem("company"));
  
  const CheckAuth = ({ children }) => {
    let loggedIn = tokenValid(); 
   
    if (!loggedIn ) {
      return <Navigate to="/login" replace />;
    }
    console.log("user logged in: " + loggedIn);
    return children;
  }


  useEffect(()=> {
 
    getCompany().then((res) =>  {setCompany(res);});
           
    },[]) // empty array means it only run once

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <IconButton sx={{ mr: 2, mb: 2, position: 'absolute', bottom: 0, right: 0 }} onClick={toggleColorMode} color="inherit">
        {theme.palette.mode === 'dark' ? <DarkModeIcon sx={{ width: 40, height: 40 }} /> : <LightModeIcon sx={{ width: 40, height: 40 }} />}
      </IconButton>
      <TopBar company={company}/>

      <Routes>
        <Route path="/" element={
          <CheckAuth redirect="/login"> 
            <Front company={company} setCompany={setCompany} getCompany={getCompany}/>
          </CheckAuth>
        } />
        <Route path="/login" element={
          <Login setUser={setUser} setCompany={setCompany} getCompany={getCompany}/>
        } />
        <Route path="/company" element={
          <CheckAuth redirect="/login">
            <Company  company={company} setCompany={setCompany}/>
          </CheckAuth>
        } />
        <Route path="/warehouses" element={
          <CheckAuth redirect="/login">
            <Warehouses company={company}/>
          </CheckAuth>
        } />
        <Route path="*" element={
          <CheckAuth redirect="/login">
            <Front company={company} setCompany={setCompany} getCompany={getCompany}/>
          </CheckAuth>
        } />
      </Routes>
    </ThemeProvider>
  );
  function toggleColorMode() {

    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));

  }

}

