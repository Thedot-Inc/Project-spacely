import { API } from "../../backend"


export const send = (phone) => {
    console.log(API);
    return fetch(`${API}/signup`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(phone)
        })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
}


export const verify = (code) => {
    console.log(API);
    return fetch(`${API}/verify`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(code)
        })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
}