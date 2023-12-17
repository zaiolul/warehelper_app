//???????????????????????????
export function getJwtToken() {
    // console.log(sessionStorage.getItem("jwt"))
    return !sessionStorage.getItem("jwt") ?  null: sessionStorage.getItem("jwt")
}

export function setJwtToken(token) {
   sessionStorage.setItem("jwt", token)
}

export function getRefreshToken() {
    return typeof sessionStorage.getItem("refreshToken") === "undefined" ? null : sessionStorage.getItem("refreshToken")
}

export function setRefreshToken(token) {
    sessionStorage.setItem("refreshToken", token)
}

export function tokenValid(){
    let token = getJwtToken();
    // console.log("token: " + token);
    if(token == "null" || token == null) {
      
        sessionStorage.clear()
        localStorage.clear()
        return false;
    }
       
    let decoded =  JSON.parse(atob(token.split('.')[1]));
   
    sessionStorage.setItem("name", decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]);
    let roles = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
   
    sessionStorage.setItem("role", typeof(roles) == "object" ? roles[roles.length - 1] : roles);
    sessionStorage.setItem("exp", decoded.exp);
    sessionStorage.setItem("id", decoded.sub);

    if(decoded.exp >= Date.now() / 1000)
        return true;
    else return false;
}


export function getName(){
    if(!tokenValid())
        return null;
    return sessionStorage.getItem("name");
}
export function getId(){
    if(!tokenValid())
    return null;
    return sessionStorage.getItem("id");
}

export function getRole(){
    if(!tokenValid())
        return null;

    return sessionStorage.getItem("role");
}

