export function postRequest(url, param) {
  return fetch("https://api.crtefoundation.org:8000/" + url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "auth-token": getToken(),
    },
    body: JSON.stringify(param),
  })
    .then((response) => {
      if (response.status == 401) {
        localStorage.removeItem("session");
        window.location = "login";
        return;
      }
      return response.json();
    })

    .catch((error) => {
      console.log(error);
    });
}

const getToken = () => {
  const token = localStorage.getItem("session");
  return token;
};
