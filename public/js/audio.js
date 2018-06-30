/*var audio=document.createElement("audio");
audio.src="music/满舒克 - 做我的猫.mp3";
audio.play();
*/
//实现歌曲顺序循环播放
/*window.onload = function() {
	//初始化播放列表
	var alist = ["music/满舒克 - 做我的猫.mp3", "music/Joel Adams - Please Do Not Go.mp3", "music/FKJ - Drops.mp3"];
	var alen = alist.length; //数组长度
	var curr = 0;
	var audio = document.createElement("audio");
	audio.src = alist[curr];
	audio.play();
	audio.addEventListener('ended', function() {
	    curr=(curr+1)%alen;
		audio.src = alist[curr];
		audio.play();
		audio.loop=false;
	}, false);

}
*/


//随机循环播放

window.onload = function() {
	var alist = ["music/满舒克 - 做我的猫.mp3", "music/Joel Adams - Please Do Not Go.mp3", "music/FKJ - Drops.mp3"];
	var alen = alist.length; //数组长度
	var curr = parseInt(Math.random() * alen);
	var audio = document.createElement("audio");
	aplay(); //递归调用
	function aplay() {
	
        curr=(curr+1)%alen;
		audio.src = alist[curr];
		audio.play();
		audio.loop = false;
		audio.addEventListener("ended", function() {
			aplay();
		}, false);

	}
}
