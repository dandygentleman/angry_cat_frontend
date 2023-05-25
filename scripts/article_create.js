async function postArticleButton(){
    const response = await postArticle();

    if(response.status == 201) {
        alert("글작성 완료!")
        window.location.replace(`${frontend_base_url}/`);
    } else {
        alert(response.status)
    }
}