let articleId


async function loadArticle(){
    const response = await getArticle(articleId);

    if(response.status == 200) {
        response_json = await response.json()
        
        const articleTitle = document.getElementById("title")
        articleTitle.setAttribute("value",response_json.title)
    } else {
        alert(response.status)
    }
}


async function updateArticleButton(){
    const response = await updateArticle(articleId);

    if(response.status == 200) {
        alert("글이 저장되었습니다.")
        window.location.replace(`${frontend_base_url}/`);
    } else {
        alert(response.status)
    }
}

async function genMentButton(){
    const response = await genMent();
    const response_json= await response.json()

    if(response.status == 200) {
        alert("고양이의 답변이 도착")
        var cat_says=document.getElementById("cat_says")
        cat_says.innerText=response_json.message
        
    } else {
        for (var param in response_json) {
            alert(`${param}:${response_json[param]}`);
        }
    }

}


window.onload = async function() {
    const urlParams = new URLSearchParams(window.location.search);
    articleId = urlParams.get('article_id');

    await loadArticle();
}