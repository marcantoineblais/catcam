const requestJSON = async (url) => {
  const response =  await fetch(url, {
    method: "GET",
    mode: "cors",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  })

  return await response.json()
}

export default requestJSON