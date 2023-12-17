import { blueGrey, grey } from '@mui/material/colors';


export const CustomThemePalette = (mode) => ({
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            // palette values for light mode
          
            primary: grey,
            divider: grey[200],
            text: {
              primary: grey[900],
              secondary: grey[800],
            },
          }
        : {
            // palette values for dark mode
            primary: blueGrey,
            divider: blueGrey[700],
            background: {
              default: blueGrey[900],
              paper: blueGrey[900],
            },
            text: {
              primary: '#fff',
              secondary: grey[500],
            },
          }),
    },
  });
  