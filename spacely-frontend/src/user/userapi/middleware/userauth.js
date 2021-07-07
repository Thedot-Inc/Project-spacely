export const usertempauthenticate = (data, next) => {
    if (typeof window !== "undefined") {
        localStorage.setItem("jwt_temp", JSON.stringify(data));
        next();
    }
}


export const userrealauthenticate = (data, next) => {
    if (typeof window !== "undefined") {
        localStorage.setItem("jwt_original", JSON.stringify(data));
        next();
    }
}