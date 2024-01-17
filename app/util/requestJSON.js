async function requestJSON(url) {
    let response

    try {
        response = await fetch(url, {
            method: "GET",
            mode: "cors",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        })
    } catch(ex) {
        console.error("Error fetching data.")
        return null  
    }

    return await response.json()
}

export default requestJSON