async function injectNavbar(){
    fetch("./navbar.html").then(response => {
        return response.text()
    })
        .then(data => {
            document.querySelector("header").innerHTML = data;
        })
    
    let navbarHtml = await fetch("./navbar.html")
    let data = await navbarHtml.text()
    document.querySelector("header").innerHTML = data;


    const payload = localStorage.getItem("payload");
    if(payload){
        const payload_parse = JSON.parse(payload)

        let navbarLeft = document.getElementById("navbar-left")
        let articleCreateLi = document.createElement("li")
        articleCreateLi.setAttribute("class","nav-item")

        let articleCreateLink = document.createElement("a")
        articleCreateLink.setAttribute("class","nav-link")
        articleCreateLink.setAttribute("href","/article_create.html")
        articleCreateLink.innerHTML = "글 작성"
        articleCreateLi.appendChild(articleCreateLink)

        let bookmarkPageLi = document.createElement("li")
        bookmarkPageLi.setAttribute("class","nav-item")

        let bookmarkPageLink = document.createElement("a")
        bookmarkPageLink.setAttribute("class","nav-link")
        bookmarkPageLink.setAttribute("href","/bookmarkpage.html")
        bookmarkPageLink.innerHTML = "북마크"
        bookmarkPageLi.appendChild(bookmarkPageLink)

        navbarLeft.append(articleCreateLi)
        navbarLeft.append(bookmarkPageLi)

        let navbarRight = document.getElementById("navbar-right")
        let logoutLi = document.createElement("li")
        logoutLi.setAttribute("class","nav-item")

        let logoutBtn = document.createElement("button")
        logoutBtn.setAttribute("class","nav-link btn")
        logoutBtn.innerText = "로그아웃"
        logoutBtn.setAttribute("onclick", "handleLogout()")
        logoutLi.appendChild(logoutBtn)
        
        let mypageLi = document.createElement("li")
        mypageLi.setAttribute("class","nav-item")

        let mypageLink = document.createElement("a")
        mypageLink.setAttribute("class","nav-link")
        mypageLink.setAttribute("href",`/mypage.html?user_id=${payload_parse.user_id}`)
        mypageLink.innerHTML = "마이페이지"
        mypageLi.appendChild(mypageLink)

        navbarRight.append(mypageLi)
        navbarRight.append(logoutLi)

        let loginButton = document.getElementById("login-button")
        loginButton.style.display = "none";
    }
}


injectNavbar();