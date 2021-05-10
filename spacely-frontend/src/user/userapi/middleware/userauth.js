export const usertempauthenticate = (data, next) => {
    if (typeof window !== "undefined") {
        localStorage.setItem("jwt_temp", JSON.stringify(data));
        next();
    }
}