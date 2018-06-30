$(function(){
setInterval("clock()",1000);

});

function clock(){
	var t=new Date();
	var hour=t.getHours();
	var min=t.getMinutes();
	var sec=t.getSeconds();
	var time="Now Time :" + hour.toString()+" : "+min.toString()+" : "+sec.toString();
	$("#time").text(time);
	return;
}
