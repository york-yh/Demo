function remove_all(event) { //清空垃圾桶
	var myremove = document.getElementById("remove");
	event.preventDefault();
	myremove.style.display = "block";
	myremove.style.top = event.clientY + "px";
	myremove.style.left = event.clientX + "px";
	$("#menu").css("display","none");
	document.getElementById("a_remove").href = "/removeAll?list=3";
	document.addEventListener("click", function(event) {
		myremove.style.display = "none";
	});
}

function InputAdd(){
	if($("#addmore").val()==""){
		$("#messageTwo").text("不能添加空列表");
		$("#up").css("display","block");
		return false;
	}
	my_hide();
	return true;
}

function my_hide() {//几乎没有作用，应为会重新加载页面
	$("#up").slideUp(400);

}

$(function(){
	$("#divId").css("display","none");
	$("#divId").slideDown(1500);
});

//$(function(){
//	$("#backhead").click(function(){
//		$("#up").slideUp(400);
//	});
//	$("#events").click(function(){
//		$("#up").slideUp(400);
//	});
//});

function delete_list(event, id) { //删除列表
	var myMenu = document.getElementById("menu");
	event.preventDefault();
	myMenu.style.display = "block";
	myMenu.style.top = event.clientY + "px";
	myMenu.style.left = event.clientX + "px";
	$("#remove").css("display", "none");
	document.getElementById("a_menu").href = "/deleteList?id=" + id;
	document.addEventListener("click", function(event) {
		myMenu.style.display = "none";
	});
}

function tips(obj) {//ajax异步提交提示
	if(obj.value == "")return;
	let param = {
		keys: obj.value
	};
	$.ajax({
		type: "get",
		url: "/tips",
		async: true,
		data: param,
		dataType: 'jsonp',
		jsonpCallback: 'callback',
		success: (data) => {
			let ul = document.getElementById("search_ul");
			let tip = document.getElementById("search_tip");
			let title = document.getElementById("search_title");
			if(data.length == 0) {
				$("#search_tip").slideUp(400);
				return;
			}
			$("#search_tip").slideDown(400);
			ul.innerHTML = "";
			let len = data.length > 5 ? 5 : data.length;
			for(let i = 0; i < len; i++) {
				let li = document.createElement("li");
				li.style.listStyle='none';
				li.innerHTML = data[i].title;
				li.onclick = ()=>{
					title.value = data[i].title;
				}
				ul.appendChild(li);
			}
			document.addEventListener("click", function(event) {
				$("#search_tip").slideUp(400);
			});
		}
	});
}
