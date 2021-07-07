import { API } from "../../backend";

export const postPlace = (data) => {
    return fetch(`${API}/admin/postplace`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
}