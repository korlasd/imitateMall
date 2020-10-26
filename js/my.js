// 关闭广告
function btnclose(){
	const div1=document.getElementById("div1");
	div1.style.display="none";
}
//秒杀时间
        $(document).ready(function () {
            var oDate = new Date();
            var nowTime = oDate.getTime(); //现在的毫秒数
            oDate.setDate(oDate.getDate() + 1); // 设定截止时间为第二天
            var targetDate = new Date(oDate.toLocaleDateString());
            run(targetDate);
        });

        function run(enddate) {
            getDate(enddate);
            setInterval("getDate('" + enddate + "')", 500);
        }

        function getDate(enddate) {
            var oDate = new Date(); //获取日期对象

            var nowTime = oDate.getTime(); //现在的毫秒数
            var enddate = new Date(enddate);
            var targetTime = enddate.getTime(); // 截止时间的毫秒数
            var second = Math.floor((targetTime - nowTime) / 1000); //截止时间距离现在的秒数

            var day = Math.floor(second / 24 * 60 * 60); //整数部分代表的是天；一天有24*60*60=86400秒 ；
            second = second % 86400; //余数代表剩下的秒数；
            var hour = Math.floor(second / 3600); //整数部分代表小时；
            second %= 3600; //余数代表 剩下的秒数；
            var minute = Math.floor(second / 60);
            second %= 60;
            var spanH = $('.se-txt')[0];
            var spanM = $('.se-txt')[1];
            var spanS = $('.se-txt')[2];

            spanH.innerHTML = tow(hour);
            spanM.innerHTML = tow(minute);
            spanS.innerHTML = tow(second);
        }

        function tow(n) {
            return n >= 0 && n < 10 ? '0' + n : '' + n;
        }



//切换页面
function change1(){
	var div6_li1=document.querySelectorAll(".div6_context_left_top2 li");
	var div6_li2=document.querySelectorAll(".div6_context_left_bottom_1");
	
		div6_li1[0].style.background="whitesmoke";
		for(var i=1;i<div6_li2.length;i++){
			div6_li2[i].style.display="none";
		}
		for(var j=0;j<div6_li1.length;j++){
			
			div6_li1[j].num=j;
			
			div6_li1[j].onmouseover=function(){
				
				for(var k=0;k<div6_li1.length;k++){
					div6_li1[k].style.background="";
					div6_li2[k].style.display="none";
					
				}
				this.style.background="whitesmoke"
				div6_li2[this.num].style.display="block";
				
			}
		}
		
}
change1();

//无缝轮播图
function change2(){
	var odiv = document.getElementById('div7_context_right');
	
				var oul = odiv.getElementsByTagName('ul')[0];
				var ali = oul.getElementsByTagName('li');
				
				var spa = -2;				
				oul.innerHTML=oul.innerHTML+oul.innerHTML;
				oul.style.width=ali[0].offsetWidth*ali.length+'px';
				function move(){
					if(oul.offsetLeft<-oul.offsetWidth/2){
						oul.style.left='0';
					}
					if(oul.offsetLeft>0){
						oul.style.left=-oul.offsetWidth/2+'px'
					}
					oul.style.left=oul.offsetLeft+spa+'px';
				}
				var timer = setInterval(move,20)
				
				odiv.onmousemove=function(){clearInterval(timer);}
				odiv.onmouseout=function(){timer = setInterval(move,20)};
				document.getElementsByTagName('a')[0].onclick = function(){
					spa=-2;
				}
				document.getElementsByTagName('a')[1].onclick = function(){
					spa=2;
				}
}
change2();
//切换页面2(div8)
function change3(){
	var div8_li1=document.querySelectorAll(".div8_context_ul li")
	var div8_li2=document.querySelectorAll(".div8_context_ul1_li")
	div8_li1[0].style.background="red";
	
	for(var i=1;i<div8_li2.length;i++){
		div8_li2[i].style.display="none";
	}
	for(var j=0;j<div8_li1.length;j++){
		
		div8_li1[j].num=j;
		
		div8_li1[j].onmouseover=function(){
			
			for(var k=0;k<div8_li1.length;k++){
				div8_li1[k].style.background="";
				div8_li2[k].style.display="none";
				
			}
			this.style.background="red"
			div8_li2[this.num].style.display="block";
			
		}
	}
	
}
change3();