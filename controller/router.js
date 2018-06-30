const formidable = require("formidable");
const dao = require("../model/dao.js");

function getDate(callback) {
	let now = new Date();
	let year = now.getFullYear();
	let month = now.getMonth() + 1;
	let day = now.getDate();
	if(month < 10) month = "0" + month;
	if(day < 10) day = "0" + day;
	callback({
		"year": year,
		"month": month,
		"day": day
	});
}

exports.Get_login = (request, response, next) => { //根据情况获取登陆页面
	let tips = "";
	let tip=0;
	let tip1 = request.query.tip;
    if(tip1!=0) tip=tip1;
	if(tip == "1") tips = "用户名或密码错误";
	else if(tip == "2") tips = "请先登陆账户";
	else if(tip == "3") tips = "您的登陆信息已经失效，请重新登陆";
	else if(tip == "4") tips = "请填写注册账户,点击确认";
	else if(tip == "5") tips = "注册成功，请登录"

	response.render("login", {
		"tips": tips,
		"tip":tip
	});
}

exports.Post_login = (request, response, next) => { //登陆判断，成功则转向主页。否则继续登陆
	let tip = 0;
	let tips = request.query.tip;
	if(tips != 0) tip = tips;
	let form = new formidable.IncomingForm();
	form.parse(request, (err, fields, files) => {
		if(err) {
			console.log("表单解析失败");
			next();
			return;
		}
		let userName = fields.userName;
		let userPass = fields.userPass;
		let sql = "select * from login where userName = '" + userName + "' and userPass = '" + userPass + "'";
		dao.query(sql, (err, result) => {
			if(err) {
				console.log(err);
				next();
				return;
			}
			
			if(result.length == 0) {
				if(tip == 4) {
					let sql = "insert into login values(null,?,?)";
					let params = [userName, userPass];
					dao.add(sql, params, (err, result) => {
						if(err) {
							console.log(err);
							next();
							return;
						}
						response.writeHead(302, {
							"Location": "http://127.0.0.1:3000/login?tip=5"
						});
						response.end();
					});
					return;
				} 
				else{
					response.writeHead(302, {
						"Location": "http://127.0.0.1:3000/login?tip=1"
					});
					response.end();
				}
			} 
			else {
				global.userid=result[0].id;//创建一个全局变量，用于区别不同用户储存在数据库中的不同数据
				response.writeHead(302, {
					"Location": "http://127.0.0.1:3000/index?list=2"
				});
				request.session.userName = userName;
			}
			response.end();
		});
	});
}

exports.Post_registe = (request, response, next) => { //简单注册功能
	response.writeHead(302, {
		"Location": "http://127.0.0.1:3000/login?tip=4"
	});
	response.end();

}

exports.Get_index = (request, response, next) => { //获取主页
	if(request.session.userName == null) {
		response.writeHead(302, {
			"Location": "http://127.0.0.1:3000/login?tip=2"
		});
		response.end();
		return;
	}
	let list = 2;
	let re_list = request.query.list;
	if(re_list != null) list = parseInt(re_list);
	let sql = "select * from lists where type = 'child'";
	dao.query(sql, (err, left_result) => {
		if(err) {
			console.log(err);
			next();
			return;
		}
		if(list == 1) {
			getDate((result) => {
				let time = result.year + "-" + result.month + "-" + result.day;
				sql = "select * from things where isdelete = 0 and time = '" + time + "' order by urgent desc,time asc";
			});
		} else if(list == 2) sql = "select * from things where isdelete = 0 and uid= '"+userid+"' order by urgent desc,time asc";
		else if(list == 3) sql = "select * from things where isdelete = 1 order by urgent desc,time asc";
		else sql = "select * from things where isdelete = 0 and list_id = " + list + " order by urgent desc,time asc";
		dao.query(sql, (err, right_result) => {
			if(err) {
				console.log(err);
				next();
				return;
			}
			response.render("index", {
				"left": left_result,
				"right": right_result,
				"list_flag": list,
			});
		});
	});
}

exports.Post_addThing = (request, response, next) => { //增加事件
	if(request.session.userName == null) {
		response.writeHead(302, {
			"Location": "http://127.0.0.1:3000/login?tip=2"
		});
		response.end();
		return;
	}
	let form = new formidable.IncomingForm();
	form.parse(request, (err, fields, files) => {
		if(err) {
			console.log(err);
			next();
			return;
		}
		let title = fields.title;
		let message = fields.message;
		let year = fields.year;
		let month = fields.month;
		let day = fields.day;
		if(month < 10) month = "0" + parseInt(fields.month);
		if(day < 10) day = "0" + parseInt(fields.day);
		let list_id = parseInt(request.query.list);
		let time = year + "-" + month + "-" + day;
		let urgent = parseInt(fields.urgent);
		let sql = "insert into things values(null,?,?,?,?,0,?,?)";
		let params = [title, message, urgent, time, list_id,userid];
		dao.add(sql, params, (err, result) => {
			if(err) {
				console.log(err);
				next();
				return;
			}
			response.writeHead(302, {
				"Location": "http://127.0.0.1:3000/index?list=" + list_id
			});
			response.end();
		});
	});
}

exports.Post_modify = (request, response, next) => { //实现事件的修改
	if(request.session.userName == null) {
		response.writeHead(302, {
			"Location": "http://127.0.0.1:3000/login?tip=2"
		});
		response.end();
		return;
	}
	let form = new formidable.IncomingForm();
	form.parse(request, (err, fields, files) => {
		if(err) {
			console.log(err);
			next();
			return;
		}
		let id = parseInt(fields.id);
		let title = fields.title;
		let message = fields.message;
		let year = fields.year;
		let month = fields.month;
		let day = fields.day;
		if(month < 10) month = "0" + parseInt(fields.month);
		if(day < 10) day = "0" + parseInt(fields.day);
		let time = year + "-" + month + "-" + day;
		let urgent = parseInt(fields.urgent);
		let sql = "update things set title=?,message=?,urgent=?,time=? where id=?";
		let params = [title, message, urgent, time, id];
		dao.update(sql, params, (err, result) => {
			if(err) {
				console.log(err);
				next();
				return;
			}
			response.writeHead(302, {
				"Location": "http://127.0.0.1:3000/index?list=2"
			});
			response.end();
		});
	});
}
//exports.Get_modifydemo=(request,response,next) =>{
//	if(request.session.userName == null) {
//		response.writeHead(302, {
//			"Location": "http://127.0.0.1:3000/login?tip=2"
//		});
//		response.end();
//		return;
//	}
//	if(request.query.id == null) return;
//	let id=request.query.id;
//	let title=request.query.title;
//	let message=request.query.message;
//	let down=request.query.down;
//	let up_month=request.query.up_month;
//	let down_day=request.query.down_day;
//	let list=request.query.list;
//	let right={"object":null};
//	let left={"object":null};
//	let mofy={
//		"id":id,
//		"title":title,
//		"message":message,
//		"down":down,
//		"up_month":up_month,
//		"down_day":down_day,
//		
//	};
//	let re_list = request.query.list;
//	if(re_list != null) list = parseInt(re_list);
//	let sql = "select * from lists where type = 'child'";
//	dao.query(sql, (err, left_result) => {
//		if(err) {
//			console.log(err);
//			next();
//			return;
//		}
//		if(list == 1) {
//			getDate((result) => {
//				let time = result.year + "-" + result.month + "-" + result.day;
//				sql = "select * from things where isdelete = 0 and time = '" + time + "' order by urgent desc,time asc";
//			});
//		} 
//		else if(list == 2) sql = "select * from things where isdelete = 0 order by urgent desc,time asc";
//		else if(list == 3) sql = "select * from things where isdelete = 1 order by urgent desc,time asc";
//		else sql = "select * from things where isdelete = 0 and list_id = " + list+" order by urgent desc,time asc";
//		dao.query(sql, (err, right_result) => {
//			if(err) {
//				console.log(err);
//				next();
//				return;
//			}
//			response.render("index", {
//				"left": left_result,
//				"right": right_result,
//				"list_flag": list,
//				"mofy":mofy
//			});
//		});
//	});
//			
//	
//	
//}

exports.Get_deleteThing = (request, response, next) => { //删除某一事件，软删除
	if(request.session.userName == null) {
		response.writeHead(302, {
			"Location": "http://127.0.0.1:3000/login?tip=2"
		});
		response.end();
		return;
	}
	if(request.query.id == null) return;
	let id = parseInt(request.query.id);
	let list_id = request.query.list;
	let sql = "update things set isdelete = 1 where id=?";
	dao.update(sql, [id], (err, result) => {
		if(err) {
			console.log(err);
			next();
			return;
		}
		response.writeHead(302, {
			"Location": "http://127.0.0.1:3000/index?list=" + list_id
		});
		response.end();
	});
}

exports.Get_removeThing = (request, response, next) => { //删除某一事件，硬删除
	if(request.session.userName == null) {
		response.writeHead(302, {
			"Location": "http://127.0.0.1:3000/login?tip=2"
		});
		response.end();
		return;
	}
	if(request.query.id == null) return;
	let id = parseInt(request.query.id);
	let list_id = request.query.list;
	let sql = "delete from things where id=" + id;
	dao.remove(sql, (err, result) => {
		if(err) {
			console.log(err);
			next();
			return;
		}
		response.writeHead(302, {
			"Location": "http://127.0.0.1:3000/index?list=" + list_id
		});
		response.end();
	});
}

exports.Get_removeAll = (request, response, next) => { //清空垃圾桶
	if(request.session.userName == null) {
		response.writeHead(302, {
			"Location": "http://127.0.0.1:3000/login?tip=2"
		});
		response.end();
		return;
	}
	let list_id = request.query.list;
	let sql = "delete from things where isdelete=1";
	dao.remove(sql, (err, result) => {
		if(err) {
			console.log(err);
			next();
			return;
		}
		response.writeHead(302, {
			"Location": "http://127.0.0.1:3000/index?list=" + list_id
		});
		response.end();
	});
}

exports.Post_addList = (request, response, next) => { //增加列表的操作
	if(request.session.userName == null) {
		response.writeHead(302, {
			"Location": "http://127.0.0.1:3000/login?tip=2"
		});
		response.end();
		return;
	}
	let form = new formidable.IncomingForm();
	form.parse(request, (err, fields, files) => {
		if(err) {
			console.log("表单解析失败");
			next();
			return;
		}
		let listName = fields.listName;
		let sql = "insert into lists values(null,?,'child')";
		dao.add(sql, [listName], (err, result) => {
			if(err) {
				console.log(err);
				next();
				return;
			}
			response.writeHead(302, {
				"Location": "http://127.0.0.1:3000/index?list=2"
			});
			response.end();
		});
	});
}

exports.Get_deleteList = (request, response, next) => { //删除列表
	if(request.session.userName == null) {
		response.writeHead(302, {
			"Location": "http://127.0.0.1:3000/login?tip=2"
		});
		response.end();
		return;
	}
	let id = request.query.id;
	let sql = "delete from lists where id=" + id;
	dao.remove(sql, (err, result) => {
		if(err) {
			console.log(err);
			next();
			return;
		}
		sql = "delete from things where list_id = " + id;
		dao.remove(sql, (err, result) => {
			if(err) {
				console.log(err);
				next();
				return;
			}
			response.writeHead(302, {
				"Location": "http://127.0.0.1:3000/index?list=2"
			});
			response.end();
		});
	});
}

exports.Post_search = (request, response, next) => { //实现模糊匹配
	if(request.session.userName == null) {
		response.writeHead(302, {
			"Location": "http://127.0.0.1:3000/login?tip=2"
		});
		response.end();
		return;
	}
	let form = new formidable.IncomingForm();
	form.parse(request, (err, fields, files) => {
		if(err) {
			console.log("表单解析失败");
			next();
			return;
		}
		let listName = fields.search_title;
		let sql = "select * from lists where type = 'child'";
		dao.query(sql, (err, left_result) => {
			if(err) {
				console.log(err);
				next();
				return;
			}
			sql = "select * from things where isdelete=0 and title like '%" + listName + "%' order by urgent desc,time asc";
			dao.query(sql, (err, right_result) => {
				if(err) {
					console.log(err);
					next();
					return;
				}
				response.render("index", {
					"left": left_result,
					"right": right_result,
					"list_flag": -1
				});
			});
		});
	});
}

exports.Get_tips = (request, response, next) => { //搜索提示
	let callback = request.query.callback;
	let data = request.query.keys;
	let sql = "select * from things where isdelete = 0 and title like '%" + data + "%' order by urgent desc,time asc";
	dao.query(sql, (err, result) => {
		if(err) {
			console.log(err);
			next();
			return;
		}
		response.send(callback + "(" + JSON.stringify(result) + ")");
	});
}