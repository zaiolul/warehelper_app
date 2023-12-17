const API_LOCAL = "http://localhost:58780/api"
const API_REMOTE = "https://warehelper.azurewebsites.net"


const dev ={
    URL: API_LOCAL,
};
const prod = {
    URL: API_REMOTE,
};

const API = process.env.NODE_ENV === 'development' ? dev : prod;

export default API;
