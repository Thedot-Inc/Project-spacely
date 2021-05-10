import { API } from "../../backend"

export const profile = (profile) => {
    return fetch(`${API}/userprofile`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(profile)
        })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
}