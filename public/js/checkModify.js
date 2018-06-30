function checkmofy() {
	let dateday = new Date();
	let nowyear = dateday.getFullYear();
	let nowmonth=dateday.getMonth()+1;
	let nowday=dateday.getDate();
	let days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	let maxday=days[--nowmonth];
	if((nowyear % 4 == 0 && nowyear % 100 != 0) || nowyear % 400 == 0) days[1]++;
	//判断title
	if($("#modal_title").val() == "") {
		$("#modal_message").text("标题不能为空");
		return false;
	}
	if($("#modal_title").val().length > 10) {
		$("#modal_message").text("标题过长");
		return false;
	}
	//判断备注
	if($("#modal_beizhu").val() == "") {
		$("#modal_message").text("备注不能为空");
		return false;
	}
	//判断year
	if(isNaN($("#modal_year").val()) || $("#modal_year").val().length != 4 || $("#modal_year").val() < nowyear) {
		$("#modal_message").text("year不合法");
		return false;
	}
	//判断month
	if(isNaN($("#modal_month").val()) || $("#modal_month").val() == "" ||$("#modal_month").val()<1 || $("#modal_month").val() >= 13||$("#modal_month").val()<nowmonth) {
		$("#modal_message").text("month不合法");
		return false;
	}
	if($("#modal_month").val().substring(0,1)=="-"){
		$("#modal_message").text("month不合法");
		return false;
	}
	//判断day
	if(isNaN($("#modal_day").val()) || $("#modal_day").val() == ""|| $("#modal_day").val() > maxday||$("#modal_day").val()<nowday) {
        $("#modal_message").text("day不合法");
        return false;
	}
	if($("#modal_day").val().substring(0,1)=="-"){//检测输入负数时候，直接检测第一个符号就行
		$("#modal_message").text("day不合法");
		return false;
	}
	return true;
}