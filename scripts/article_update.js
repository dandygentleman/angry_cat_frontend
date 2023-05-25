let articleId


async function loadArticle(){
    const response = await getArticle(articleId);

    if(response.status == 200) {
        response_json = await response.json()
        
        const articleTitle = document.getElementById("title")
        const articleDescription = document.getElementById("description")

        articleTitle.setAttribute("value",response_json.title)
        articleDescription.innerText = response_json.description
    } else {
        alert(response.status)
    }
}


async function updateArticleButton(){
    const response = await updateArticle(articleId);

    if(response.status == 200) {
        alert("수정 완료!")
        window.location.replace(`${frontend_base_url}/`);
    } else {
        alert(response.status)
    }
}


window.onload = async function() {
    const urlParams = new URLSearchParams(window.location.search);
    articleId = urlParams.get('article_id');

    await loadArticle();
}