export const userCheckAuth = () => {
    if (typeof window == "undefined") {
        return false;
    }
    if (localStorage.getItem("jwt_original")) {
        console.log("User yes");
        return JSON.parse(localStorage.getItem("jwt_original"));
    } else {
        return false;
    }
}