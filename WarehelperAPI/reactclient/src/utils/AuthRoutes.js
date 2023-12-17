import {  Navigate,Route,  Outlet} from "react-router-dom";
import { tokenValid } from "./Auth";
import { NavbarItems } from "./NavbarItems";

export const Protected = () =>{
    console.log(tokenValid());
    return tokenValid() ? <Outlet /> : <Navigate to="/login" replace />;
}

export const Anonymous = () =>{
    console.log(tokenValid());
    return tokenValid() ? <Navigate to="/login" replace /> : <Outlet />;
}

function PrivateRoute ({component: Component, ...rest}) {
    return (
      <Route
        {...rest}
        render={(props) => tokenValid() === true
          ? <Component {...props} />
          : <Navigate to={{pathname: '/login', state: {from: props.location}}} />}
      />
    )
  }
export default PrivateRoute