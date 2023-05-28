const frontend_base_url = "http://127.0.0.1:5500"
const backend_base_url = "http://127.0.0.1:8000"


window.onload = () => {
    console.log("로딩되었음")
}

async function parse_payload(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return jsonPayload
}

async function refresh() {
    const refresh_token = localStorage.getItem("refresh")
    if (refresh_token == null) {
        return null
    }
    const response = await fetch(`${backend_base_url}/user/refresh/`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
            "refresh": refresh_token
        })
    })
    if (response.status == 401) {
        alert("로그아웃되었습니다 다시 로그인해주세요")
        localStorage.removeItem("payload")
        localStorage.removeItem("access")
        localStorage.removeItem("refresh")
        window.location.href=`${frontend_base_url}`
        return null
    }
    const response_json = await response.json();
    const jsonPayload = await parse_payload(response_json.access);
    localStorage.setItem("payload", jsonPayload);
    localStorage.setItem("access", response_json.access);
    return localStorage.getItem("access")
}
async function get_access_token() {
    const token = localStorage.getItem('access')
    if (token == null) {

        return null
    }
    else {
        const response = await fetch(`${backend_base_url}/user/verify/`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ "token": token })
        })
        if (response.status == 200) {
            return token
        }
        else {
            return await refresh()
        }
    }
}

async function handleSignup() {
    const username = document.getElementById("username").value
    const password = document.getElementById("password").value
    const password2 = document.getElementById("password2").value
    const email = document.getElementById("email").value

    const response = await fetch(`${backend_base_url}/user/sign/`, {
        headers: {
            'content-type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
            "username": username,
            "password": password,
            "password2": password2,
            "email": email
        })
    })

    return response
}


async function handleLogin() {
    const username = document.getElementById("username").value
    const password = document.getElementById("password").value

    const response = await fetch(`${backend_base_url}/user/token/`, {
        headers: {
            'content-type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
            "username": username,
            "password": password
        })
    })

    return response
}



function handleLogout() {
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    localStorage.removeItem("payload")
    window.location.replace(`${frontend_base_url}/`)
}


function checkLogin(){
    const payload = localStorage.getItem("payload");
    if(payload){
        window.location.replace(`${frontend_base_url}/`)
    }
}


async function handleSignout() {
    const password = document.getElementById("signout-password").value
    let token = localStorage.getItem("access")

    const response = await fetch(`${backend_base_url}/user/sign/`, {
        headers: {
            'content-type': 'application/json',
            "Authorization": `Bearer ${token}`
        },
        method: 'PUT',
        body: JSON.stringify({
            "password": password
        })
    })

    return response
}


async function handlePasswordChange() {
    const currentPassword = document.getElementById("current-password").value
    const newpassword = document.getElementById("new-password").value
    const newpassword2 = document.getElementById("new-password2").value
    let token = await get_access_token()

    const response = await fetch(`${backend_base_url}/user/sign/`, {
        headers: {
            'content-type': 'application/json',
            "Authorization": `Bearer ${token}`
        },
        method: 'PATCH',
        body: JSON.stringify({
            "current_password": currentPassword,
            "password": newpassword,
            "password2": newpassword2
        })
    })

    return response
}


async function getUserInfo(){
    let token = await get_access_token()
    const response = await fetch(`${backend_base_url}/user/sign/`, {
        headers: {
            "Authorization": `Bearer ${token}`
        },
        method: 'GET'
    })

    return response
}


async function changeUserInfo(){
    const currentPassword = document.getElementById("current-password").value
    const bio = document.getElementById("bio").value
    let token = await get_access_token()

    const response = await fetch(`${backend_base_url}/user/sign/`, {
        headers: {
            'content-type': 'application/json',
            "Authorization": `Bearer ${token}`
        },
        method: 'PATCH',
        body: JSON.stringify({
            "current_password": currentPassword,
            "bio": bio
        })
    })

    return response
}


async function getArticles(pageNum, filter){
    const response = await fetch(`${backend_base_url}/article/?page=${pageNum}&filter=${filter}`)
    
    if(response.status==200){
        const response_json = await response.json()
        return response_json
    }else{
        alert("불러오는데 실패했습니다")
    }

}


async function postArticle(){
    const title = document.getElementById("title").value
    const description = document.getElementById("description").value
    const pictures = document.getElementById("picture_id").value
    const cat_says=document.getElementById("cat_says").value
    const formdata = new FormData();

    formdata.append('title',title)
    formdata.append('description',description)
    formdata.append('cat_says',cat_says)
    formdata.append('pictures',pictures)

    let token = await get_access_token()
    const response = await fetch(`${backend_base_url}/article/`, {
        headers: {
            "Authorization": `Bearer ${token}`
        },
        method: 'POST',
        body: formdata
    })

    return response
}


async function getArticle(articleId){
    const response = await fetch(`${backend_base_url}/article/${articleId}/`)

    return response
}


async function updateArticle(articleId){
    const data = {}
    const title = document.getElementById("title").value
    
    const description = document.getElementById("description").value
    const cat_says = document.getElementById("cat_says").value
    
    data['title'] = title
    data['description'] =description
    data['cat_says'] = cat_says
    

    let token = await get_access_token()
    
    const response = await fetch(`${backend_base_url}/article/${articleId}/`, {
        headers: {
            'content-type': 'application/json',
            "Authorization": `Bearer ${token}`
        },
        method: 'PUT',
        body: JSON.stringify(data)
    })

    return response
}


async function deleteArticle(articleId){
    let token = await get_access_token()
    const response = await fetch(`${backend_base_url}/article/${articleId}/`, {
        method: 'DELETE',   
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })

    if(response.status == 204) {
        alert("삭제 완료!")
        window.location.replace(`${frontend_base_url}/`);
    } else {
        alert(response.status)
    }
}
 

async function likeArticle(articleId){
    let token = await get_access_token()

    const response = await fetch(`${backend_base_url}/article/${articleId}/like/`, {
        method: 'POST',   
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })

    if(response.status == 200) {
        response_json = await response.json()
        alert(response_json.message)
        location.reload();
    } else {
        alert(response.status)
    }
}


async function bookmarkArticle(articleId){
    let token = await get_access_token()
    const response = await fetch(`${backend_base_url}/article/${articleId}/bookmark/`, {
        method: 'POST',   
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })

    if(response.status == 200) {
        response_json = await response.json()
        alert(response_json.message)
        location.reload();
    } else {
        alert(response.status)
    }
}


async function getBookmarkArticles(pageNum){
    let token = await get_access_token()
    const response = await fetch(`${backend_base_url}/article/?page=${pageNum}&filter=bookmarked`, {
        headers: {
            "Authorization": `Bearer ${token}`
        },
        method: 'GET'
    })

    if(response.status==200){
        const response_json = await response.json()
        return response_json
    }else{
        alert("불러오는데 실패했습니다")
    }
}


async function getUserIdInfo(userId){
    const response = await fetch(`${backend_base_url}/user/sign/${userId}/`)
    if(response.status==200){
        const response_json = await response.json()
        return response_json
    }else if(response.status==404){
        alert("탈퇴했거나 존재하지 않는 회원입니다")
        window.location.href=`${frontend_base_url}`
    }else{
        alert("불러오는데 실패했습니다")
        window.location.href=`${frontend_base_url}`
    }
}
async function getUserIdArticles(userId,pageNum){
    const response = await fetch(`${backend_base_url}/article/?page=${pageNum}&filter=user&user_id=${userId}`)
    if(response.status==200){
        const response_json = await response.json()
        return response_json
    }else{
        alert("불러오는데 실패했습니다")
    }
}


async function getComments(articleId){
    const response = await fetch(`${backend_base_url}/article/${articleId}/comment/`)

    if(response.status == 200) {
        response_json = await response.json()
        return response_json
    } else {
        alert(response.status)
    }
}


async function postComment(articleId, newComment){
    let token = await get_access_token()
    const response = await fetch(`${backend_base_url}/article/${articleId}/comment/`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            "content": newComment,
        })
    })

    return response
}


async function updateComment(commentId, newComment){
    let token = await get_access_token()
    const response = await fetch(`${backend_base_url}/article/comment/${commentId}/`, {
        method: 'PUT',
        headers: {
            'content-type': 'application/json',
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            "content": newComment,
        })
    })

    return response
}


async function deleteComment(commentId){
    let token = await get_access_token()
    const response = await fetch(`${backend_base_url}/article/comment/${commentId}/`, {
        method: 'DELETE',
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })

    return response
}

async function getOauthUrl() {
    const response = await fetch(
        backend_base_url+"/user/google/url/"
    );
    const response_json = await response.json();
    console.log(response_json);
    await oauthSignIn(
        response_json["client_id"],
        response_json["redirect_uri"]
    );
}
async function oauthSignIn(key, redirecturi) {
    var oauth2Endpoint =
        "https://accounts.google.com/o/oauth2/v2/auth";

    var form = document.createElement("form");
    form.setAttribute("method", "GET");
    form.setAttribute("action", oauth2Endpoint);
    var params = {
        client_id: key,
        redirect_uri: redirecturi,
        response_type: "token",
        scope: "email",
        include_granted_scopes: "true",
        state: "pass-through value",
        prompt: "consent",
    };

    for (var p in params) {
        var input = document.createElement("input");
        input.setAttribute("type", "hidden");
        input.setAttribute("name", p);
        input.setAttribute("value", params[p]);
        form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit()
}

async function getGoogleOAuthTokens(){
    const access_token = new URLSearchParams(location.href).get(
        "access_token"
    );
    if (access_token==undefined){
        return 0
    }
    const response = await fetch(
        backend_base_url+"/user/google/token/",
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ access_token: access_token }),
        }
    );
    if(response.status==200){
        const response_json = await response.json()

        localStorage.setItem("access", response_json.access);
        localStorage.setItem("refresh", response_json.refresh);
        const jsonPayload = await parse_payload(response_json.access);
        localStorage.setItem("payload", jsonPayload);
        window.location.replace(`${frontend_base_url}/`)
    }else{
        alert(response.status)
    }
}
async function genImage(){
    const image = document.getElementById("image").files[0]
    if(image){
        console.log(image)
    }else{
        console.log("fail1")
        console.log(image)
    }

    const formdata = new FormData();
    formdata.append('input_pic',image)
    let token = await get_access_token()
    const response = await fetch(`${backend_base_url}/article/picgen/`, {
        headers: {
            "Authorization": `Bearer ${token}`
        },
        method: 'POST',
        body: formdata
    })

    return response
}
async function genMent(){
    const description = document.getElementById("description").value
    let token = await get_access_token()
    const response = await fetch(`${backend_base_url}/article/mentgen/`, {
        headers: {
            "Authorization": `Bearer ${token}`,
            "content-type": "application/json",
        },
        method: 'POST',
        body: JSON.stringify({"description":description})
    })
    return response
}
