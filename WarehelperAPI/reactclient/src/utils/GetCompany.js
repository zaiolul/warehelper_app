import API from "./ApiUrl";

export default async function getCompany(){
    let cm = JSON.parse(localStorage.getItem("assigned"))
    if(!cm)
        return
    let url = API.URL + "/companies"
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
    
    if(response == null){
        // localStorage.setItem("company", null);
        
    } else{
      
        let company = response.filter((c) => c["id"] == cm["company"])[0];
     
        // props.setCompany(company);
        company = company == undefined ? null : company;
        // localStorage.setItem("company", company)
        return company
       
        // localStorage.setItem("company", company ? JSON.stringify(company) : null);
       
    }
    return null;
}