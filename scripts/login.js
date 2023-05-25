async function handleLoginButton(){
    const response = await handleLogin();

    if(response.status==200){
        const response_json = await response.json()

        localStorage.setItem("access", response_json.access);
        localStorage.setItem("refresh", response_json.refresh);
        const jsonPayload = await parse_payload(response_json.access);

        localStorage.setItem("payload", jsonPayload);
        alert("환영합니다.")
        window.location.replace(`${frontend_base_url}/`)
    }else{
        alert(response.status)
    }
}


checkLogin()