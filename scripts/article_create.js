async function postArticleButton(){
    const response = await postArticle();

    if(response.status == 201) {
        alert("글작성 완료!")
        window.location.replace(`${frontend_base_url}/`);
    } else {
        alert(response.status)
        console.log(await response.json())
    }
}

async function genImageButton(){
    const response = await genImage();
    const response_json= await response.json()

    if(response.status == 201) {
        alert("고양이 생성 완료")
        var inputPic=document.getElementById("input_pics")
        var changePic=document.getElementById("change_pics")
        var picture_id=document.getElementById("picture_id")
        inputPic.innerHTML=`Input Picture:<br><img class="img-fluid" src=${backend_base_url+response_json.input_pic}></img>`
        changePic.innerHTML=`Change Picture:<br><img class="img-fluid" src=${backend_base_url+response_json.change_pic}></img>`
        picture_id.setAttribute("value",response_json.id)
        
    } else {
        for (var param in response_json) {
            alert(`${param}:${response_json[param]}`);
        }
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