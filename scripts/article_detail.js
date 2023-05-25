let articleId
let authorId


async function loadArticle(){
    const response = await getArticle(articleId);

    if(response.status == 200) {
        response_json = await response.json()

        const articleTitle = document.getElementById("article-title")
        const articleDescription = document.getElementById("article-description")
        const articleAuthor = document.getElementById("article-author")
        const likesCount = document.getElementById("likes-count")
        articleTitle.innerText = response_json.title
        articleDescription.innerText = response_json.description
        articleAuthor.innerText = response_json.author
        likesCount.innerText = response_json.likes_count
        authorId = response_json.author_id
        const commentCount=document.getElementById("comment-count")
        commentCount.innerText=`댓글 ${response_json.comment_count}개`
    } else {
        alert(response.status)
    }
}


async function loadComments(){
    const response = await getComments(articleId);
    

    const commentList = document.getElementById("comment-list")
    commentList.innerHTML = ""

    response.forEach(comment => {
        commentList.innerHTML += `
            <li class="list-group-item">
                <h5>${comment.author}</h5>
                ${comment.content}
                </li>
            `
    });
}


async function submitComment(){
    const commentElement = document.getElementById("comment-input")
    const newComment = commentElement.value
    const response = await postComment(articleId, newComment)
    commentElement.value = ""

    loadComments()
}


async function injectButton(){
    let buttonArea = document.getElementById("button-area")

    let authorBtn = document.createElement("a")
    authorBtn.setAttribute("class","btn btn-outline-primary")
    authorBtn.setAttribute("href",`/profile.html?user_id=${authorId}`)
    authorBtn.innerText = "작성자"

    let likeBtn = document.createElement("button")
    likeBtn.setAttribute("type","button")
    likeBtn.setAttribute("class","btn btn-outline-warning")
    likeBtn.setAttribute("onclick",`likeArticle(${articleId})`)
    likeBtn.innerText = "좋아요"

    let bookmarkBtn = document.createElement("button")
    bookmarkBtn.setAttribute("type","button")
    bookmarkBtn.setAttribute("class","btn btn-outline-success")
    bookmarkBtn.setAttribute("onclick",`bookmarkArticle(${articleId})`)
    bookmarkBtn.innerText = "북마크"

    let updateBtn = document.createElement("a")
    updateBtn.setAttribute("class","btn btn-outline-secondary")
    updateBtn.setAttribute("href",`/article_update.html?article_id=${articleId}`)
    updateBtn.innerText = "수정"

    let deleteBtn = document.createElement("button")
    deleteBtn.setAttribute("type","button")
    deleteBtn.setAttribute("class","btn btn-outline-danger")
    deleteBtn.setAttribute("onclick",`deleteArticle(${articleId})`)
    deleteBtn.innerText = "삭제"

    buttonArea.append(authorBtn)
    buttonArea.append(likeBtn)
    buttonArea.append(bookmarkBtn)
    buttonArea.append(updateBtn)
    buttonArea.append(deleteBtn)
}


window.onload = async function() {
    const urlParams = new URLSearchParams(window.location.search);
    articleId = urlParams.get('article_id');

    await loadArticle();
    await injectButton();
    await loadComments();
}