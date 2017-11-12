function select(element){
    var id = $(element).attr("id");
    for (i = 1 ; i < 9; i++){
        $("img[id='"+i+"']").attr("name","-");
        $("img[id='"+i+"']").attr("style","border-width: 0px;"); 
    }
    if($("img[id='"+id+"']").attr("name") != "selected"){
        $("img[id='"+id+"']").attr("name","selected");
        $("img[id='"+id+"']").attr("style","border-width: 1px; border-style: solid;");
    }
    $("div.avatar").attr("id",id);
}