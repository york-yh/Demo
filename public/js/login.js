//登录检测
function log() {

	if($("#Account").val() == "") {
		alert("请输入账号！");
		return false;

	}
	if($("#pass-word").val() == "") {
		alert("密码错误！");
		return false;

	}

	return true;
}
//查询检测和同步控制
function checkSearch(){
	if($("#search_title").val()==""){
        alert("搜索内容不能为空！");
        return false;
	}
	
	return true;
}

//检测ADD添加
function checkAdd(){
	if($("#exampleInputEmail1").val()==''||$("#exampleInputEmail1").val()==null){
		$("#message").text("请输入标题");
		return false
	}
	if($("#beizhu").val()==""||$("#beizhu").val()==null){
		$("#message").text("请输入待办详情");
		return false;
	}
	return true;
}
function logout(){
	//注销下拉
	$("#pic").slideDown(400);
}
function loseblur(){
	//注销上拉
	$("#pic").slideUp(400);
}

function logoutTwo(){
	$("#add").slideDown(400);
}
function up(){
	$("#add").slideUp(400);
}
$(function(){
	
	$("#head img").click(function(){
		logout();
	
});
//检测添加清单事件
//function InputAdd(){
//	if(){
//		
//	}
//	
//}

var a=setInterval(function(){
	if($("#head").css("display")=="block"){
		setTimeout(function(){loseblur();},4000);
	}
},5000)

	$("#pic").click(function(){
		 loseblur();
	});
	$("#test").click(function(){
		loseblur();
	});
	$("#add_list").click(function(){
		logoutTwo();
	});
});
$(function(){
	//检测登录状态
	
	
$("#changeFontSize").on("click",function(){
	if($("#search_title").val()!=""){
		var fontsize=20;
			$("#divId").css('font-size',fontsize);
			$("#divId").css('color','#E38D13');
		    $("#divId").text("正在搜索"+'\"'+ $("#coke").val() +'\"');//字符串拼接
//		    $.ajax({
//					url: '/tips', 
//					dataType: "jsonp",
//					data: {"data": $("#coke").val()},
//					type: 'POST',
//					jsonpCallback: 'callback',
//					success: function(data) {
//						alert(data);
//					},
//					error: function(xhr, status, error) {
//						alert("mmm");
//					},
//				});
		    return;
	}
	else{
		var fontsize=70;
		$("#divId").css('font-size',fontsize);
		$("#divId").css('color','#5CB85C');
	    $("#divId").text("Will-Do");
	    return;
	   }
});
});
	
//setInterval(function(){
//	checkButton();
//},1000);
//
////同步显示搜索内容
//function checkButton(){
//	if($("#coke").val()!=null&&$("#coke").val()!=''){
//		$("#changeFontSize").on("click",function(){
//			var fontsize=20;
//			$("#divId").css('font-size',fontsize);
//			$("#divId").css('color','#E38D13');
//		    $("#divId").text("正在搜索"+'\"'+ $("#coke").val() +'\"');//字符串拼接
//		    return;
//		});
//	}
//	else{
//		var fontsize=70;
//		$("#divId").css('font-size',fontsize);
//		$("#divId").css('color','#5CB85C');
//	    $("#divId").text("Will-Do");
//	    return;
//	   }
//	return true;
//}
