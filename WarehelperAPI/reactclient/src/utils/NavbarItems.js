export const NavbarItems= [
    {
        id: 0,
        title: "pagrindinis",
        role: ["Worker", "Admin"],
        requires:["company"],
        route: "/"
    },
    {
        id: 1,
        title: "Įmonės informacija",
        role: "Admin",
        requires:["company"],
        route: "/company"
    },
    {
        id: 2,
        title: "Sandėliai",
        role: ["Worker", "Admin"],
        requires:["company"],
        route: "/warehouses"
    },
    {
        id: 3,
        title: "Atsijungti",
        role: ["Worker", "Admin"],
        requires:["none"],
        route: "/login"
    }
];