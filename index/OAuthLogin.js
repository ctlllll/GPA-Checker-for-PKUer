/* 让FF 7 支持outerHTML*/
	try{
		if (typeof(HTMLElement) != "undefined") {
		   HTMLElement.prototype.__defineSetter__("outerHTML", function(s) {
		        var r = this.ownerDocument.createRange();
		        r.setStartBefore(this);
		        var df = r.createContextualFragment(s);
		        this.parentNode.replaceChild(df, this);
		        return s;
		    });
		   HTMLElement.prototype.__defineGetter__("outerHTML", function(){
		        var a = this.attributes, str = "<" + this.tagName, i = 0;
		        for (; i < a.length; i++)
		            if (a[i].specified)
		                str += " " + a[i].name + '="' + a[i].value + '"';
		        if (!this.canHaveChildren)
		            return str + " />";
		        return str + ">" + this.innerHTML + "</" + this.tagName + ">";
		    });

		    HTMLElement.prototype.__defineGetter__("canHaveChildren", function(){
		        return !/^(area|base|basefont|col|frame|hr|img|br|input|isindex|link|meta|param)$/.test(this.tagName.toLowerCase());
		    });
		}
	}catch(e){
	}
document.onkeydown = function(e){
   if(!e) e = window.event;//火狐中是 window.event
   if((e.keyCode || e.which) == 13){
    if(e.target.id=="user_name"){
    	e.preventDefault();
    	//enterPassword(e);/*默认回车就是进入下一个元素*/
    }
    else if(e.target.id=="password"){
    	if($("#sms_area:visible").length>0 || $("#otp_area:visible").length>0 || $("#code_area:visible").length>0){
	    	e.preventDefault();
	    	/*if($("#otp_button:visible").length>0){
				enterCode2Bind(e);
			}
			else
	    		enterSMSCode(e);*/
    	}
    }
    else if(e.target.id=="sms_code" || e.target.id=="otp_code" ){
    	if($("#code_area:visible").length>0){
	    	e.preventDefault();
	    	//enterCode(e);
    	}
    }
   }
}
function logon () {
   if($("#user_name").val()=="" || $("#user_name").val()=="学号/职工号/北大邮箱") {
     	//$("#msg").text("账号不能为空");
     	$("#msg").html("<i class=\"fa fa-minus-circle\"></i> 账号不能为空");
     	$("#user_name").focus();
   }else if($("#password").val()=="" ||$("#password").val()=="密码") {
     	//$("#msg").text("密码不能为空");
   		$("#msg").html("<i class=\"fa fa-minus-circle\"></i> 密码不能为空");
     	$("#password").focus();
   }
   else if($("#otp_area:visible").length>0 &&
   	($("#otp_code").val()==""  ||	$("#otp_code").val()=="动态口令")) {
     	$("#msg").html("<i class=\"fa fa-minus-circle\"></i> 动态口令不能为空");
     	$("#otp_code").focus();
   }
   else if($("#sms_area:visible").length>0 &&
   	($("#sms_code").val()==""  ||	$("#sms_code").val()=="短信验证码")) {
     	$("#msg").html("<i class=\"fa fa-minus-circle\"></i> 短信验证码不能为空");
     	$("#sms_code").focus();
   }
   else if($("#code_area:visible").length>0 &&
   	($("#valid_code").val()==""  ||	$("#valid_code").val()=="验证码")) {
     	//$("#msg").text("验证码不能为空");
     	$("#msg").html("<i class=\"fa fa-minus-circle\"></i> 验证码不能为空");
     	$("#valid_code").focus();
   }
   else { //document.myForm.submit();
   		if($("#remember_check")[0].checked==true){
   			setCookie("userName",$("#user_name").val());
   			setCookie("remember","true");
   		}
   		else{
   			delCookie("userName");
   			delCookie("remember");
   		}
   		$("#msg").text("正在登录...");
   		$.ajax(	'/iaaa/login.do',
			{
				type:"POST",
				data:{
					userName: $("#user_name").val(),
					password: $("#password").val(),
					randCode: $("#valid_code").val(),
					smsCode:$("#sms_code").val(),
					otpCode:$("#otp_code").val()
				},
				dataType:"json",
				success : function(data,status,xhr) {
					var json = data;
                	if(true == json.success)
                    	window.location.href = "./index.jsp";
                    else{
                    	//$("#msg").text(json.errors.msg);
                    	$("#msg").html("<i class=\"fa fa-minus-circle\"></i> "+json.errors.msg);
                    	$("#code_img")[0].src="/iaaa/servlet/DrawServlet?Rand="+Math.random();
                    	if("账号未激活"==json.errors.msg){
                    		window.location.href = "https://iaaa.pku.edu.cn/iaaa/activateAccount.jsp?Rand="+Math.random()+"&activeCode="+json.activeCode;
                    		/*window.location.href = "http://162.105.132.*:7001/iaaa/activateAccount.jsp?Rand="+Math.random()+"&activeCode="+json.activeCode;	//做验证码测试时
*/                    	}
                    	else if("用户名错误"==json.errors.msg){
                    		$("#user_name").select();
                    	}
                    	else if("密码错误"==json.errors.msg){
                    		$("#password").select();
                    		if(true==json.showCode){
                    			$("#code_area").show();
                    		}
                    	}
                    	else if("验证码错误"==json.errors.msg){
                    		$("#code_area").show();
                			$("#valid_code").select();
                    	}
                    	else if("短信验证码错误或已过期"==json.errors.msg){
                    		$("#sms_code").select();
                    	}
                    	else if("动态口令错误或已过期"==json.errors.msg){
                    		$("#otp_code").select();
                    	}
                    }
				},
				error : function(xhr,status,error) {
					//$("#msg").text("查询时出现异常");
					$("#msg").html("<i class=\"fa fa-minus-circle\"></i> 查询时出现异常");
					$("#code_img").attr("src","/iaaa/servlet/DrawServlet?Rand="+Math.random());
				}
			});
   }
}
function oauthLogon () {
   if($("#user_name").val()=="" || $("#user_name").val()=="学号/职工号/北大邮箱") {
     	//$("#msg").text("账号不能为空");
     	$("#msg").html("<i class=\"fa fa-minus-circle\"></i> 账号不能为空");
     	$("#user_name").focus();
   }else if($("#password").val()=="" ||$("#password").val()=="密码") {
     	//$("#msg").text("密码不能为空");
   		$("#msg").html("<i class=\"fa fa-minus-circle\"></i> 密码不能为空");
     	$("#password").focus();
   }
   else if($("#otp_area:visible").length>0 &&
   	($("#otp_code").val()==""  ||	$("#otp_code").val()=="动态口令")) {
     	$("#msg").html("<i class=\"fa fa-minus-circle\"></i> 动态口令不能为空");
     	$("#otp_code").focus();
   }
   else if($("#sms_area:visible").length>0 &&
   	($("#sms_code").val()==""  ||	$("#sms_code").val()=="短信验证码")) {
     	$("#msg").html("<i class=\"fa fa-minus-circle\"></i> 短信验证码不能为空");
     	$("#sms_code").focus();
   }
   else if($("#code_area:visible").length>0 &&
   	($("#valid_code").val()==""  ||	$("#valid_code").val()=="验证码")) {
     	//$("#msg").text("验证码不能为空");
     	$("#msg").html("<i class=\"fa fa-minus-circle\"></i> 验证码不能为空");
     	$("#valid_code").focus();
   }
   else { //document.myForm.submit();
   		if($("#remember_check")[0].checked==true){
   			setCookie("userName",$("#user_name").val());
   			setCookie("remember","true");
   		}
   		else{
   			delCookie("userName");
   			delCookie("remember");
   		}
   		$("#msg").text("正在登录...");
   		$.ajax('/iaaa/oauthlogin.do',
   			{
   				type:"POST",
				data:{appid: $("#appid").val(),
					userName: $("#user_name").val(),
					password: $("#password").val(),
					randCode: $("#valid_code").val(),
					smsCode:$("#sms_code").val(),
					otpCode:$("#otp_code").val(),
					redirUrl:redirectURL
				},
				dataType:"json",
				success : function(data,status,xhr) {
					var json = data;
                	if(true == json.success){
                		/*//如果是弱口令 显示#msg 提示
                		if(json.isFlag){
                			$("#msg").text("密码强度不足，请尽快登录门户修改");
                			setTimeout(function(){
                				if(redirectURL.indexOf("?")>0)
		               			window.location.href = redirectURL+"&rand="+Math.random()+"&token="+json.token;
		               		else
		                   		window.location.href = redirectURL+"?rand="+Math.random()+"&token="+json.token;
                			},2000);
                		}else{*/
	                		if(redirectURL.indexOf("?")>0)
	                			window.location.href = redirectURL+"&rand="+Math.random()+"&token="+json.token;
	                		else
	                    		window.location.href = redirectURL+"?rand="+Math.random()+"&token="+json.token;
	                    //}
                    }
                    else{
                    	$("#msg").html("<i class=\"fa fa-minus-circle\"></i> "+json.errors.msg);
                    	$("#code_img")[0].src="/iaaa/servlet/DrawServlet?Rand="+Math.random();
                    	if("账号未激活"==json.errors.msg){
                    		window.location.href = "https://iaaa.pku.edu.cn/iaaa/activateAccount.jsp?Rand="+Math.random()+"&activeCode="+json.activeCode;
                    		//window.location.href = "http://162.105.132.115:7001/iaaa/activateAccount.jsp?Rand="+Math.random()+"&activeCode="+json.activeCode;
                    	}
                    	else if("用户名错误"==json.errors.msg){
                    		$("#user_name").select();
                    		if(true==json.showCode){
                    			$("#code_area").show();
                    		}
                    	}
                    	else if("密码错误"==json.errors.msg){
                    		$("#password").select();
                    	}
                    	else if(json.isFlag){
                			//如果是弱口令 允许登录，但是，显示#msg 提示，
                			/*$("#msg").text("密码强度不足，请尽快登录门户修改");
                			setTimeout(function(){
                				if(redirectURL.indexOf("?")>0)
		               			window.location.href = redirectURL+"&rand="+Math.random()+"&token="+json.token;
		               		else
		                   		window.location.href = redirectURL+"?rand="+Math.random()+"&token="+json.token;
                			},2000);*/
                			//20170928跳转到修改弱密码页面
                			var logonId = $("#user_name").val();
                			window.location.href = "https://iaaa.pku.edu.cn/iaaa/weakPwdModify.jsp?Rand="+Math.random()+"&logonId="+logonId;
                			//window.location.href = "http://162.105.132.115:7001/iaaa/weakPwdModify.jsp?Rand="+Math.random()+"&logonId="+logonId;
                			//end 20170928跳转到修改弱密码页面
                		}
                    	else if("验证码错误"==json.errors.msg){
                    		$("#code_area").show();
                    		$("#valid_code").select();
                    	}
                    	else if("短信验证码错误或已过期"==json.errors.msg){
                    		$("#sms_code").select();
                    	}
                    	else if("动态口令错误或已过期"==json.errors.msg){
                    		$("#otp_code").select();
                    	}
                    }
				},
				error : function(xhr,status,error) {
					$("#msg").html("<i class=\"fa fa-minus-circle\"></i> 查询时出现异常");
					$("#code_img").attr("src","/iaaa/servlet/DrawServlet?Rand="+Math.random());
				}
			});
   }
}
function proxyLogon () {
   if($("#user_name").val()=="" || $("#user_name").val()=="学号/职工号/北大邮箱") {
     	//$("#msg").text("账号不能为空");
     	$("#msg").html("<i class=\"fa fa-minus-circle\"></i> 账号不能为空");
     	$("#user_name").focus();
   }else if($("#otp_area:visible").length>0 &&
   	($("#otp_code").val()==""  ||	$("#otp_code").val()=="动态口令")) {
     	$("#msg").html("<i class=\"fa fa-minus-circle\"></i> 动态口令不能为空");
     	$("#otp_code").focus();
   }
   else if($("#sms_area:visible").length>0 &&
   	($("#sms_code").val()==""  ||	$("#sms_code").val()=="短信验证码")) {
     	$("#msg").html("<i class=\"fa fa-minus-circle\"></i> 短信验证码不能为空");
     	$("#sms_code").focus();
   }else {
   		/*if($("#remember_check")[0].checked==true){
   			setCookie("userName",$("#user_name").val());
   			setCookie("remember","true");
   		}
   		else{
   			delCookie("userName");
   			delCookie("remember");
   		}*/
   		$("#msg").text("正在登录...");
   		$.ajax('/iaaa/mobileAuth4proxy.do',
   			{
   				type:"POST",
				data:{appid: $("#appid").val(),
					userName: $("#user_name").val(),
					grantToken: $("#grantToken").val(),
					proxyAppId: $("#proxyAppId").val(),
					smsCode:$("#sms_code").val(),
					otpCode:$("#otp_code").val(),
					redirUrl:redirectURL
				},
				dataType:"json",
				success : function(data,status,xhr) {
					var json = data;
                	if(true == json.success){
                		if(redirectURL.indexOf("?")>0){
                			window.location.href = redirectURL+"&rand="+Math.random()+"&token="+json.token;

                		}
                		else{
                			window.location.href = redirectURL+"?rand="+Math.random()+"&token="+json.token;
                		}
                    }
                    else{
                    	$("#msg").html("<i class=\"fa fa-minus-circle\"></i> "+json.errors.msg);
                    	$("#code_img")[0].src="/iaaa/servlet/DrawServlet?Rand="+Math.random();
                    	if("账号未激活"==json.errors.msg){
                    		window.location.href = "https://iaaa.pku.edu.cn/iaaa/activateAccount.jsp?Rand="+Math.random()+"&activeCode="+json.activeCode;
                    	}
                    	else if("用户名错误"==json.errors.msg){
                    		$("#user_name").select();
                    		if(true==json.showCode){
                    			$("#code_area").show();
                    		}
                    	}
                    	else if("短信验证码错误或已过期"==json.errors.msg){
                    		$("#sms_code").select();
                    	}
                    	else if("动态口令错误或已过期"==json.errors.msg){
                    		$("#otp_code").select();
                    	}
                    }
				},
				error : function(xhr,status,error) {
					$("#msg").html("<i class=\"fa fa-minus-circle\"></i> 查询时出现异常");
					$("#code_img").attr("src","/iaaa/servlet/DrawServlet?Rand="+Math.random());
				}
			});
   }
}
function redirectLogon(){
	window.location.href = redirectLogonURL;
}
function changeCode(){
	$("#code_img")[0].src="/iaaa/servlet/DrawServlet?Rand="+Math.random();
}
function focusUserName(){
	var name=$("#user_name").val();
	if(""!=name && "学号/职工号/北大邮箱"!=name){
		$("#user_name").css("color","#000000");
	}
	/*$("#user_name")[0].style.color="#000000";
	$("#user_name").select();
	*/
}
function leaveUserName(){
	var name=$("#user_name").val();
	if(""==name || "学号/职工号/北大邮箱"==name){
		$("#user_name").val("学号/职工号/北大邮箱");
		$("#user_name").css("color","#B7B7B9");
	}
}
function enterPassword(keypressed){
	var key;
    if (document.all) {
        key=window.event.keyCode;
    }
    else {
        key=keypressed.which;
    };
	if(key==13){
		$("#password").focus();
	}
	else{
		var name=$("#user_name").val();
		if(""==name || "学号/职工号/北大邮箱"==name){
			$("#user_name").val("");
			$("#user_name").css("color","#000000");
		}
		$("#user_name").next(".i-clear").show();
	}
}
function focusPassword(){
  /*var val = $("#password").val();
  if("密码"==val){
       $("#password")[0].outerHTML="<input class='input-txt-row input-txt-pad' type='password' id='password'  name='password' tabIndex = '2' value='' onFocus='focusPassword()' onblur='leavePassword()' onKeyDown='enterSMSCode(event)'  onMouseOver='changeBorderColor(this)' onMouseOut='backBorderColor(this)'/>";
       $("#password").css("color","#000000");
       $("#password").focus();
  }*/
  $("#password").css("color","#000000");
  $("#password").next(".i-clear").show();
  $("#password").select();
}
function focusPassword2Bind(){
  /*var val = $("#password").val();
  if("密码"==val){
       $("#password")[0].outerHTML="<input class='input-txt-row input-txt-pad' type='password' id='password'  name='password' tabIndex = '2' value='' onFocus='focusPassword()' onblur='leavePassword()' onKeyDown='enterCode2Bind(event)'  onMouseOver='changeBorderColor(this)' onMouseOut='backBorderColor(this)'/>";
       $("#password").css("color","#000000");
       $("#password").focus();
  }*/
  $("#password").css("color","#000000");
  $("#password").next(".i-clear").show();
  $("#password").select();
}
function leavePassword(){
  var val = $("#password").val();
  if(""==val){
	   //$("#password")[0].outerHTML="<input class='input-txt-row input-txt-pad' type='text' id='password' name='password' tabIndex = '2'  value='密码' onFocus='focusPassword()' onblur='leavePassword()' onKeyDown='enterSMSCode(event)'  onMouseOver='changeBorderColor(this)' onMouseOut='backBorderColor(this)''/>";
	   $("#password").css("color","#B7B7B9");
	   $("#password").next(".i-clear").hide();
  }
}
/**
 * 口令输入回车之后
 * @param {} keypressed
 */
function enterSMSCode(keypressed){
	var key;
    if (document.all) {
        key=window.event.keyCode;
    }
    else {
        key=keypressed.which;
    };

	if(key==13){
		if($("#sms_area:visible").length>0){
			$("#sms_code").focus();
			$("#sms_code").select();
		}
		else if($("#otp_area:visible").length>0){
			$("#otp_code").focus();
			$("#otp_code").select();
		}
		else if($("#code_area:visible").length>0){
			$("#valid_code").focus();
			$("#valid_code").select();
		}
		else if(0==$("#appid").length)
			//logon();/*改用button的focus，可以避免两次提交。*/
			$("#logon_button").focus();
		else
			//oauthLogon();
			$("#logon_button").focus();
	}
	else{
		$("#password").next(".i-clear").show();
	}
}
/**
 * 回车之后进入验证码区域
 * @param {} keypressed
 */
function enterCode(keypressed){
	var key;
    if (document.all) {
        key=window.event.keyCode;
    }
    else {
        key=keypressed.which;
    };

	if(key==13){
		if($("#code_area:visible").length>0){
			$("#valid_code").focus();
			$("#valid_code").select();
		}
		else if(0==$("#appid").length)
			//logon();/*改用button的focus，可以避免两次提交。*/
			$("#logon_button").focus();
		else
			//oauthLogon();
			$("#logon_button").focus();
	}
	else{
		if($("#sms_area:visible").length>0){
			var val=$("#sms_code").val();
			if(""==val || "短信验证码"==val){
				$("#sms_code").val("");
				$("#sms_code").css("color","#000000");
			}
			$("#sms_code").next(".i-clear").show();
		}
		else if($("#otp_area:visible").length>0){
			var val=$("#otp_code").val();
			if(""==val || "动态口令"==val){
				$("#otp_code").val("");
				$("#otp_code").css("color","#000000");
			}
			$("#otp_code").next(".i-clear").show();
		}
	}
}
function enterCode2Bind(keypressed){
	var key;
    if (document.all) {
        key=window.event.keyCode;
    }
    else {
        key=keypressed.which;
    };

	if(key==13){
		if($("#code_area:visible").length>0){
			$("#valid_code").focus();
			$("#valid_code").select();
		}
		else
			//gotoOTPBind();
			$("#otp_button").focus();
	}
	else{
		$("#password").next(".i-clear").show();
	}
}
function enterCode2Proxy(keypressed){
	var key;
    if (document.all) {
        key=window.event.keyCode;
    }
    else {
        key=keypressed.which;
    };

	if(key==13){
		proxyLogon();
	}
	else{
		if($("#sms_area:visible").length>0){
			var val=$("#sms_code").val();
			if(""==val || "短信验证码"==val){
				$("#sms_code").val("");
				$("#sms_code").css("color","#000000");
			}
			$("#sms_code").next(".i-clear").show();
		}
		else if($("#otp_area:visible").length>0){
			var val=$("#otp_code").val();
			if(""==val || "动态口令"==val){
				$("#otp_code").val("");
				$("#otp_code").css("color","#000000");
			}
			$("#otp_code").next(".i-clear").show();
		}
	}
}
function focusCode(){
	var code=$("#valid_code").val();
	if(""!=code && "验证码"!=code){
		$("#valid_code").css("color","#000000");
	}
	$("#valid_code").select();
}
function leaveCode(){
	var code=$("#valid_code").val();
	if(""==code|| "验证码"==code){
		$("#valid_code").val("验证码");
		$("#valid_code").css("color","#B7B7B9");
	}
}
function enterKey(keypressed){
	var key;
    if (document.all) {
        key=window.event.keyCode;
    }
    else {
        key=keypressed.which;
    };

	if(key==13){
		if(0==$("#appid").length)
			//logon();
			$("#logon_button").focus();
		else
			//oauthLogon();
			$("#logon_button").focus();
	}
	else{
		var val=$("#valid_code").val();
		if(""==val || "验证码"==val){
			$("#valid_code").val("");
			$("#valid_code").css("color","#000000");
		}
		$("#valid_code").next(".i-clear").show();
	}
}
function enterKey2Bind(keypressed){
	var key;
    if (document.all) {
        key=window.event.keyCode;
    }
    else {
        key=keypressed.which;
    };

	if(key==13){
		gotoOTPBind();
	}
	else{
		var val=$("#valid_code").val();
		if(""==val || "验证码"==val){
			$("#valid_code").val("");
			$("#valid_code").css("color","#000000");
		}
		$("#valid_code").next(".i-clear").show();
	}
}
function getCookie(c_name)
{
	if (document.cookie.length>0){
		c_start=document.cookie.indexOf(c_name + "=")
	  	if (c_start!=-1){
	    	c_start=c_start + c_name.length+1
	    	c_end=document.cookie.indexOf(";",c_start)
	    	if (c_end==-1)
	    		c_end=document.cookie.length
	    	return unescape(document.cookie.substring(c_start,c_end))
    	}
  	}
	return ""
}
function setCookie(c_name,value)
{
	var expiredays=30;
	var exdate=new Date()
	exdate.setDate(exdate.getDate()+expiredays)
	document.cookie=c_name+ "=" +escape(value)+
	((expiredays==null) ? "" : ";expires="+exdate.toGMTString())
}
function delCookie(name)//删除cookie
{
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=getCookie(name);
    if(cval!=null) document.cookie= name + "="+cval+";expires="+exp.toGMTString();
}
function reCalculate(){
	var offset = document.body.clientWidth-1000>0?0:document.body.clientWidth-1000;
	$("#left")[0].style.width=555+offset;
}
var viewIntr=["博雅塔","北阁","办公楼前的华表","北京大学匾额","未名湖博雅塔","南北阁"]
var viewAuth=["吕凤翥","吕凤翥","吕凤翥","吕凤翥","吕凤翥","吕凤翥"]
var vwNo=1;
function focusName(){
	vwNo = Math.round((Math.random()*10))%6+1;
	$(".mid").css("background-image","url(./index/pku_view_"+vwNo+".jpg)");
	//$("#left")[0].style.background="url(./index/pku_view_"+vwNo+".jpg) left top no-repeat";
	// $("#view-tip").html(viewIntr[vwNo-1]+"<BR>原图摄影："+viewAuth[vwNo-1]);
	var userName=getCookie('userName')
	if (userName!=null && userName!=""){
		$("#user_name").val(userName);
		$("#user_name").css("color","#000000");
	  	$("#password").focus();/*如果停在password，IE无法自动填写密码*/
//		$("#user_name").focus();
	}
	else{
	  $("#user_name").focus();
	}
	var remember=getCookie('remember')
	if (remember!=null && remember!="" && remember!="false"){
		$("#remember_check")[0].checked =true;
		$("#remember_text").children(".i-check").removeClass("fa-square-o").addClass("fa-check-square-o");
	}
	var name=$("#user_name").val();
	if(""!=name && "学号/职工号/北大邮箱"!=name){
		$("#user_name").next(".i-clear").show();
	}
	showOrHideSmsCode();
	$.ajax('/iaaa/isShowCode.do',
		{
			dataType:"json",
			success : function(data,status,xhr) {
				var json = data;
	        	if(true == json.success){
	        		$("#code_area").show();
	            }
			},
			error : function(xhr,status,error) {
			}
	});
}
//add 20171023
function focusName2OTP(){
	vwNo = Math.round((Math.random()*10))%6+1;
	$(".mid").css("background-image","url(./index/pku_view_"+vwNo+".jpg)");
	//$("#left")[0].style.background="url(./index/pku_view_"+vwNo+".jpg) left top no-repeat";
	// $("#view-tip").html(viewIntr[vwNo-1]+"<BR>原图摄影："+viewAuth[vwNo-1]);
	var userName=getCookie('userName')
	if (userName!=null && userName!=""){
		$("#user_name").val(userName);
		$("#user_name").css("color","#000000");
	  	$("#password").focus();/*如果停在password，IE无法自动填写密码*/
//		$("#user_name").focus();
	}
	else{
	  $("#user_name").focus();
	}
	var remember=getCookie('remember')
	if (remember!=null && remember!="" && remember!="false"){
		$("#remember_check")[0].checked =true;
		$("#remember_text").children(".i-check").removeClass("fa-square-o").addClass("fa-check-square-o");
	}
	var name=$("#user_name").val();
	if(""!=name && "学号/职工号/北大邮箱"!=name){
		$("#user_name").next(".i-clear").show();
	}
	//showOrHideSmsCode();
	showOrHideSmsCode2OTP();
	$.ajax('/iaaa/isShowCode.do',
		{
			dataType:"json",
			success : function(data,status,xhr) {
				var json = data;
	        	if(true == json.success){
	        		$("#code_area").show();
	            }
			},
			error : function(xhr,status,error) {
			}
	});
}

function init4Proxy(){
	vwNo = Math.round((Math.random()*10))%6+1;
	$(".mid").css("background-image","url(./index/pku_view_"+vwNo+".jpg)");
	$("#user_name").css("color","#000000");
	showOrHideSmsCodeProxy();
}
//add 20170412 for iaaa, refresh logon.jsp appId null error
function focusNameIaaa(){
	vwNo = Math.round((Math.random()*10))%6+1;
	$(".mid").css("background-image","url(./index/pku_view_"+vwNo+".jpg)");
	//$("#left")[0].style.background="url(./index/pku_view_"+vwNo+".jpg) left top no-repeat";
	// $("#view-tip").html(viewIntr[vwNo-1]+"<BR>原图摄影："+viewAuth[vwNo-1]);
	var userName=getCookie('userName')
	if (userName!=null && userName!=""){
		$("#user_name").val(userName);
		$("#user_name").css("color","#000000");
	  	$("#password").focus();/*如果停在password，IE无法自动填写密码*/
//		$("#user_name").focus();
	}
	else{
	  $("#user_name").focus();
	}
	var remember=getCookie('remember')
	if (remember!=null && remember!="" && remember!="false"){
		$("#remember_check")[0].checked =true;
		$("#remember_text").children(".i-check").removeClass("fa-square-o").addClass("fa-check-square-o");
	}
	//add 20170412 for iaaa, refresh logon.jsp appId null error
	var name=$("#user_name").val();
	if(""!=name && "学号/职工号/北大邮箱"!=name){
		$("#user_name").next(".i-clear").show();
	}
	showOrHideSmsCodeIaaa();
	//add 20170412
	$.ajax('/iaaa/isShowCode.do',
		{
			dataType:"json",
			success : function(data,status,xhr) {
				var json = data;
	        	if(true == json.success){
	        		$("#code_area").show();
	            }
			},
			error : function(xhr,status,error) {
			}
	});
}
//end 20170412
function showViewTip(){
	$("#view-tip").fadeIn();
}
function hideViewTip(){
	$("#view-tip").fadeOut();
}
function changeViewImg(){
	vwNo = vwNo%6+1;
	$(".mid").css("background-image","url(./index/pku_view_"+vwNo+".jpg)");
}
function changeBorderColor(obj){
	obj.style.borderColor="#B40605";
}
function backBorderColor(obj){
	obj.style.borderColor="#CECECE";
}
function changeOutlineColor(obj){
	obj.style.outline="1px solid #B40605";
}
function backOutlineColor(obj){
	obj.style.outline="";
}
function clickCheck(){
	if($("#remember_check").attr("checked")===true || $("#remember_check").attr("checked")==="checked"){
		$("#remember_check").removeAttr("checked");
		$("#remember_text").children(".i-check").removeClass("fa-check-square-o").addClass("fa-square-o");
	}
	else{
		$("#remember_check").attr("checked","checked");
		$("#remember_text").children(".i-check").removeClass("fa-square-o").addClass("fa-check-square-o");
	}
}
/*function mouseOverCheck(){
	if($("#remember_check").attr("checked")===true || $("#remember_check").attr("checked")==="checked"){
		$("#remember_text").css("background-image","url(/iaaa/resources/images/checkbox_yes_red.png)");
	}
	else{
		$("#remember_text").css("background-image","url(/iaaa/resources/images/checkbox_no_red.png)");
	}
}
function mouseOutCheck(){
	if($("#remember_check").attr("checked")===true || $("#remember_check").attr("checked")==="checked"){
		$("#remember_text").css("background-image","url(/iaaa/resources/images/checkbox_yes.png)");
	}
	else{
		$("#remember_text").css("background-image","url(/iaaa/resources/images/checkbox_no.png)");
	}
}*/
function showOrHideSmsCode(){
	var name=$("#user_name").val();
	var appId=$("#appid").val();//add 201702 for user/app mobile authen
	if(""==name || "学号/职工号/北大邮箱"==name){
		//hide
		$("#sms_area").hide();
		//$("#otp_area").hide();
	}
	else{
		$.getJSON('/iaaa/isMobileAuthen.do',
			//{userName: name,_rand:Math.random()},
			{userName: name,appId: appId,_rand:Math.random()},
			function(data) {
				var json = data;
            	$("#msg").text("");
            	if(true===json.success){
	            	/*if(true == json.isMobileAuthen){//OLD!
	            		$("#sms_area").show();
	                }*/
	            	//add 201705
	            	var isMobileAuthen = json.isMobileAuthen;//modi 201705 String
	            	var modeAuthen = json.authenMode;//modi 201705 String
					var isBind = json.isBind;//绑定状态 boolean
					if(true==isMobileAuthen){
						if("OTP"===modeAuthen){
							$("#sms_area").hide();
			            	$("#otp_area").show();
			            	if(false===isBind){
			            		$("#msg").text("请先绑定手机App");
			            		$("#otp_button").show();
			            		$("#logon_button").hide();
			            	}
			            	else{
			            		$("#otp_button").hide();
			            		$("#logon_button").show();
			            	}
						}
						else if("SMS"===modeAuthen){
							$("#sms_area").show();
			            	$("#otp_area").hide();
			            	$("#otp_button").hide();
			            	$("#logon_button").show();
						}
            	   }
					else{//不验证，或者有错误
						$("#sms_area").hide();
		            	$("#otp_area").hide();
		            	$("#otp_button").hide();
		            	$("#logon_button").show();
	                }
            	}
            	else{
            		if(json.errors)
	                	$("#msg").html("<i class=\"fa fa-minus-circle\"></i> "+json.errors.msg);
	               	else
	               		$("#msg").html("<i class=\"fa fa-minus-circle\"></i> 操作异常，请重试。");
            	}
			}
		);
	}
}
function showOrHideSmsCodeIaaa(){//add 201702 for user/iaaa mobile authen
	var name=$("#user_name").val();
	if(""==name || "学号/职工号/北大邮箱"==name){
		//hide
		$("#sms_area").hide();
		$("#otp_area").hide();
	}
	else{
		var appId="iaaa";//add 201702 for user/app mobile authen
		$.getJSON('/iaaa/isMobileAuthen.do',
			//{userName: name,_rand:Math.random()},
			{userName: name,appId:appId,_rand:Math.random()},
			function(data) {
				var json = data;
            	$("#msg").text("");//应清除如果已经显示的msg信息
            	if(true===json.success){
	            	/*if(true == json.isMobileAuthen){//OLD!
	            		$("#sms_area").show();
	                }*/
	            	//add 201705
	            	var isMobileAuthen = json.isMobileAuthen;//modi 201705 String
	            	var modeAuthen = json.authenMode;//modi 201705 String
					var isBind = json.isBind;//绑定状态 boolean
					if(true==isMobileAuthen){
						if("OTP"===modeAuthen){
							$("#sms_area").hide();
			            	$("#otp_area").show();
			            	if(false===isBind){
			            		$("#msg").text("请先绑定手机App");
			            		$("#otp_button").show();
			            		$("#logon_button").hide();
			            	}
			            	else{
			            		$("#otp_button").hide();
			            		$("#logon_button").show();
			            	}
						}
						else if("SMS"===modeAuthen){
							$("#sms_area").show();
			            	$("#otp_area").hide();
			            	$("#otp_button").hide();
			            	$("#logon_button").show();
						}
					}
					else{//不验证，或者有错误
						$("#sms_area").hide();
		            	$("#otp_area").hide();
		            	$("#otp_button").hide();
		            	$("#logon_button").show();
	                }
            	}
            	else{
            		if(json.errors)
	                	$("#msg").html("<i class=\"fa fa-minus-circle\"></i> "+json.errors.msg);
	                else if(json.errMsg)
	                	$("#msg").html("<i class=\"fa fa-minus-circle\"></i> "+json.errMsg);
	               	else
	               		$("#msg").html("<i class=\"fa fa-minus-circle\"></i> 操作异常，请重试。");
            	}
			}
		);
	}
}
function showOrHideSmsCodeProxy(){
	var name=$("#user_name").val();
	var appId=$("#appid").val();//add 201702 for user/app mobile authen
	if(""==name || "学号/职工号/北大邮箱"==name){
		//hide
		$("#sms_area").hide();
		//$("#otp_area").hide();
	}
	else{
		$.getJSON('/iaaa/isMobileAuthen.do',
			//{userName: name,_rand:Math.random()},
			{userName: name,appId: appId,_rand:Math.random()},
			function(data) {
				var json = data;
            	$("#msg").text("");
            	if(true===json.success){
	            	/*if(true == json.isMobileAuthen){//OLD!
	            		$("#sms_area").show();
	                }*/
	            	//add 201705
	            	var isMobileAuthen = json.isMobileAuthen;//modi 201705 String
	            	var modeAuthen = json.authenMode;//modi 201705 String
					var isBind = json.isBind;//绑定状态 boolean
					if(true==isMobileAuthen){
						if("OTP"===modeAuthen){
							$("#title-tip").text("请从您的手机中提取动态口令：");
							$("#mobile").text(json.mobileMask);
							$("#sms_area").hide();
			            	$("#otp_area").show();
			            	if(false===isBind){
			            		$("#msg").text("请先绑定手机App");
			            		$("#otp_button").show();
			            		$("#logon_button").hide();
			            	}
			            	else{
			            		$("#otp_button").hide();
			            		$("#logon_button").show();
			            	}
						}
						else if("SMS"===modeAuthen){
							$("#title-tip").text("验证码已发送至您的手机：");
							$("#mobile").text(json.mobileMask);
							$("#sms_area").show();
			            	$("#otp_area").hide();
			            	$("#otp_button").hide();
			            	$("#logon_button").show();
			            	sendSMSCode();
						}
            	   }
					else{//不验证，或者有错误
						$("#sms_area").hide();
		            	$("#otp_area").hide();
		            	$("#otp_button").hide();
		            	$("#logon_button").show();
	                }
            	}
            	else{
            		if(json.errors)
	                	$("#msg").html("<i class=\"fa fa-minus-circle\"></i> "+json.errors.msg);
	               	else
	               		$("#msg").html("<i class=\"fa fa-minus-circle\"></i> 操作异常，请重试。");
            	}
			}
		);
	}
}
//add 20171023
function showOrHideSmsCode2OTP(){
	var name=$("#user_name").val();
	var appId="iaaa";//add 20171023
	//var appId=$("#appid").val();//add 201702 for user/app mobile authen
	if(""==name || "学号/职工号/北大邮箱"==name){
		//hide
		$("#code_area").hide();
		//$("#otp_area").hide();
	}
	else{
		$.getJSON('/iaaa/isMobileAuthen.do',
			//{userName: name,_rand:Math.random()},
			{userName: name,appId: appId,_rand:Math.random()},
			function(data) {
				var json = data;
            	$("#msg").text("");
            	if(true===json.success){/*
	            	//add 201705
	            	var isMobileAuthen = json.isMobileAuthen;//modi 201705 String
	            	var modeAuthen = json.authenMode;//modi 201705 String
					var isBind = json.isBind;//绑定状态 boolean
					if(true==isMobileAuthen){
						if("OTP"===modeAuthen){
							$("#sms_area").hide();
			            	$("#otp_area").show();
			            	if(false===isBind){
			            		$("#msg").text("请先绑定手机App");
			            		$("#otp_button").show();
			            		$("#logon_button").hide();
			            	}
			            	else{
			            		$("#otp_button").hide();
			            		$("#logon_button").show();
			            	}
						}
						else if("SMS"===modeAuthen){
							$("#sms_area").show();
			            	$("#otp_area").hide();
			            	$("#otp_button").hide();
			            	$("#logon_button").show();
						}
            	   }
					else{//不验证，或者有错误
						$("#sms_area").hide();
		            	$("#otp_area").hide();
		            	$("#otp_button").hide();
		            	$("#logon_button").show();
	                }
            	*/}
            	else{
            		if(json.errors)
	                	$("#msg").html("<i class=\"fa fa-minus-circle\"></i> "+json.errors.msg);
	               	else
	               		$("#msg").html("<i class=\"fa fa-minus-circle\"></i> 操作异常，请重试。");
            	}
			}
		);
	}
}

var remainSeconds=60;
var smsCodeItv;
function reEvalSendBtn(){
	remainSeconds--;
	if(remainSeconds<=0){
		clearInterval(smsCodeItv);
		$("#sms_button").val("获取短信验证码");
		$("#sms_button").attr("disabled",false);
		$("#sms_button").css("background-color","#B40605");
		$("#sms_button").css("cursor","pointer");
	}
	else{
		$("#sms_button").val("已发送("+remainSeconds+")");
	}
}
function sendSMSCode(){
	var name=$("#user_name").val();
	var appId=$("#appid").val();//登录的应用系统ID
	if(""==name || "学号/职工号/北大邮箱"==name){
		$("#msg").html("<i class=\"fa fa-minus-circle\"></i> 账号不能为空");
     	$("#user_name").focus();
	}
	else{
		$.getJSON('/iaaa/sendSMSCode.do',
			{userName: name,appId: appId,_rand:Math.random()},
			function(data) {
				var json = data;
            	if(true == json.success){
					remainSeconds=60;
					$("#sms_button").val("已发送("+remainSeconds+")");
					$("#sms_button").attr("disabled",true);
					$("#sms_button").css("background-color","#CCCCCC");
					$("#sms_button").css("cursor","default");
					smsCodeItv = setInterval(reEvalSendBtn,1000);
					if($("#mobile").length==0)//ma4proxy中有mobile提示，故不再提示。
            			$("#msg").text("验证码已发至"+json.mobileMask);
                }
                else{
                	$("#msg").html("<i class=\"fa fa-minus-circle\"></i> "+json.message);
                }
			}
		);
		/*//add 201702,判断checkAuthenMobile
		$.getJSON('/iaaa/checkAuthenMobile.do',
			//{userName: name,_rand:Math.random()},
		{userName: name,appId: appId,_rand:Math.random()},
			function(data) {
				var json = data;
            	if(true == json.success){//如果满足条件
            		remainSeconds=60;
					$("#sms_button").val("已发送("+remainSeconds+")");
					$("#sms_button").attr("disabled",true);
					$("#sms_button").css("background-color","#CCCCCC");
					$("#sms_button").css("cursor","default");
					smsCodeItv = setInterval(reEvalSendBtn,1000);
					$.getJSON('/iaaa/sendSMSCode.do',
						//{userName: name,_rand:Math.random()},
					{userName: name,appId: appId,_rand:Math.random()},
						function(data) {
							var json = data;
			            	if(true == json.success){
			            		$("#msg").text("验证码已发至"+json.mobileMask);
			                }
			                else{
			                	$("#msg").html("<i class=\"fa fa-minus-circle\"></i> "+json.message);
			                }
						}
					);
                }
                else{
                	$("#msg").html("<i class=\"fa fa-minus-circle\"></i> "+json.message);
                }
			}
		);*/
		/*remainSeconds=60;
		$("#sms_button").val("已发送("+remainSeconds+")");
		$("#sms_button").attr("disabled",true);
		$("#sms_button").css("background-color","#CCCCCC");
		$("#sms_button").css("cursor","default");
		smsCodeItv = setInterval(reEvalSendBtn,1000);
		$.getJSON('/iaaa/sendSMSCode.do',
			//{userName: name,_rand:Math.random()},
		{userName: name,appId: appId,_rand:Math.random()},
			function(data) {
				var json = data;
            	if(true == json.success){
            		$("#msg").text("验证码已发至"+json.mobileMask);
                }
                else{
                	$("#msg").html("<i class=\"fa fa-minus-circle\"></i> "+json.message);
                }
			}
		);*/
	}
}
function sendSMSCodeIaaa(){
	var name=$("#user_name").val();
	if(""==name || "学号/职工号/北大邮箱"==name){
		$("#msg").html("<i class=\"fa fa-minus-circle\"></i> 账号不能为空");
     	$("#user_name").focus();
	}
	else{
		var appId = 'iaaa';//登录IAAA系统
		$.getJSON('/iaaa/sendSMSCode.do',
			{userName: name,appId: appId,_rand:Math.random()},
			function(data) {
				var json = data;
            	if(true == json.success){
					remainSeconds=60;
					$("#sms_button").val("已发送("+remainSeconds+")");
					$("#sms_button").attr("disabled",true);
					$("#sms_button").css("background-color","#CCCCCC");
					$("#sms_button").css("cursor","default");
					smsCodeItv = setInterval(reEvalSendBtn,1000);
            		$("#msg").text("验证码已发至"+json.mobileMask);
                }
                else{
                	$("#msg").html("<i class=\"fa fa-minus-circle\"></i> "+json.message);
                }
			}
		);
		/*//add 201702,判断checkAuthenMobile
		var appId = 'iaaa';//登录IAAA系统
		$.getJSON('/iaaa/checkAuthenMobile.do',
			//{userName: name,_rand:Math.random()},
		{userName: name,appId: appId,_rand:Math.random()},
			function(data) {
				var json = data;
            	if(true == json.success){//如果满足条件
            		remainSeconds=60;
					$("#sms_button").val("已发送("+remainSeconds+")");
					$("#sms_button").attr("disabled",true);
					$("#sms_button").css("background-color","#CCCCCC");
					$("#sms_button").css("cursor","default");
					smsCodeItv = setInterval(reEvalSendBtn,1000);
					$.getJSON('/iaaa/sendSMSCode.do',
						//{userName: name,_rand:Math.random()},
					{userName: name,appId: appId,_rand:Math.random()},
						function(data) {
							var json = data;
			            	if(true == json.success){
			            		$("#msg").text("验证码已发至"+json.mobileMask);
			                }
			                else{
			                	$("#msg").html("<i class=\"fa fa-minus-circle\"></i> "+json.message);
			                }
						}
					);
                }
                else{
                	$("#msg").text(json.message);
                	//$("#msg").html("<i class=\"fa fa-minus-circle\"></i> "+json.message);
                }
			}
		);*/
	}
}
function focusSMSCode(){
	var code=$("#sms_code").val();
	if(""!=code && "短信验证码"!=code){
		$("#sms_code").css("color","#000000");
	}
	$("#sms_code").select();
}
function leaveSMSCode(){
	var code=$("#sms_code").val();
	if(""==code|| "短信验证码"==code){
		$("#sms_code").val("短信验证码");
		$("#sms_code").css("color","#B7B7B9");
	}
}
function focusOTPCode(){
	var code=$("#otp_code").val();
	if(""!=code && "动态口令"!=code){
		$("#otp_code").css("color","#000000");
	}
	$("#otp_code").select();
}
function leaveOTPCode(){
	var code=$("#otp_code").val();
	if(""==code|| "动态口令"==code){
		$("#otp_code").val("动态口令");
		$("#otp_code").css("color","#B7B7B9");
	}
}

//公共页面oauth.jsp
//输入用户名密码后，如果启用OTP但没有绑定。add for otp验证短信验证码，如果正确可以完成绑定
function bind (userName,smsCode) {//201704
	   if(userName=="") {
		   Ext.Msg.alert("提示信息", "未指定用户！");
		   return;
	   }else if(""==smsCode){
	   		Ext.Msg.alert("提示信息", "未输入短信验证码！");
		   return;
	   }else {
	   		$.ajax(	'./userBind.do',
				{
					type:"POST",
					data:{
						userName: userName,
						smsCode: smsCode
					},
					dataType:"json",
					success : function(data,status,xhr) {
						//window.location.href = data;
						var json = data;
						//alert("json:"+json.success);
	                	if(true == json.success){
	                		alert("Bind OK!");
	                    }
	                    else{
	                    	alert("Bind Error!");
	                    }
					},
					error : function(xhr,status,error) {
						alert("json error:"+json.success);
						$("#msg").html("<i class=\"fa fa-minus-circle\"></i> 查询时出现异常");
						//$("#code_img").attr("src","/iaaa/servlet/DrawServlet?Rand="+Math.random());
					}
				});
	   }
}
/**
 * 验证用户名密码登录跳转到otpBind1.jsp
 */
function gotoOTPBind () {
	if($("#user_name").val()=="" || $("#user_name").val()=="学号/职工号/北大邮箱") {
     	$("#msg").html("<i class=\"fa fa-minus-circle\"></i> 账号不能为空");
     	$("#user_name").focus();
   }else if($("#password").val()=="" ||$("#password").val()=="密码") {
   		$("#msg").html("<i class=\"fa fa-minus-circle\"></i> 密码不能为空");
     	$("#password").focus();
   }
   else if($("#code_area:visible").length>0 &&
   	($("#valid_code").val()==""  ||	$("#valid_code").val()=="验证码")) {
     	$("#msg").html("<i class=\"fa fa-minus-circle\"></i> 验证码不能为空");
     	$("#valid_code").focus();
   }
   else {
   		if($("#remember_check")[0].checked==true){
   			setCookie("userName",$("#user_name").val());
   			setCookie("remember","true");
   		}
   		else{
   			delCookie("userName");
   			delCookie("remember");
   		}
   		$("#msg").text("正在验证身份...");
   		$.ajax(	'/iaaa/auth4Bind.do',
			{
				type:"POST",
				data:{
					userName: $("#user_name").val(),
					password: $("#password").val(),
					randCode: $("#valid_code").val()
				},
				dataType:"json",
				success : function(data,status,xhr) {
					var json = data;
                	if(true == json.success)
                    	window.location.href = "./pageFlows/identity/otpBind/otpBindO.jsp";
                    else{
                    	//$("#msg").text(json.errors.msg);
                    	$("#msg").html("<i class=\"fa fa-minus-circle\"></i> "+json.errors.msg);
                    	$("#code_img")[0].src="/iaaa/servlet/DrawServlet?Rand="+Math.random();
                    	if("账号未激活"==json.errors.msg){
                    		window.location.href = "https://iaaa.pku.edu.cn/iaaa/activateAccount.jsp?Rand="+Math.random()+"&activeCode="+json.activeCode;
                    	}
                    	else if("用户名错误"==json.errors.msg){
                    		$("#user_name").select();
                    	}
                    	else if("密码错误"==json.errors.msg){
                    		$("#password").select();
                    		if(true==json.showCode){
                    			$("#code_area").show();
                    		}
                    	}
                    	else if("验证码错误"==json.errors.msg){
                    		$("#code_area").show();
                			$("#valid_code").select();
                    	}
                    }
				},
				error : function(xhr,status,error) {
					//$("#msg").text("查询时出现异常");
					$("#msg").html("<i class=\"fa fa-minus-circle\"></i> 查询时出现异常");
					$("#code_img").attr("src","/iaaa/servlet/DrawServlet?Rand="+Math.random());
				}
			});
   }
}
function proxy2OTPBind () {
	if($("#user_name").val()=="" || $("#user_name").val()=="学号/职工号/北大邮箱") {
     	$("#msg").html("<i class=\"fa fa-minus-circle\"></i> 账号不能为空");
     	$("#user_name").focus();
   }else {
   		if($("#remember_check")[0].checked==true){
   			setCookie("userName",$("#user_name").val());
   			setCookie("remember","true");
   		}
   		else{
   			delCookie("userName");
   			delCookie("remember");
   		}
   		$("#msg").text("正在验证身份...");
   		$.ajax(	'/iaaa/authProxy4Bind.do',
			{
				type:"POST",
				data:{
					userName: $("#user_name").val(),
					proxyAppId: $("#proxyAppId").val(),
					grantToken: $("#grantToken").val(),
					_rand:Math.random()
				},
				dataType:"json",
				success : function(data,status,xhr) {
					var json = data;
                	if(true == json.success)
                    	window.location.href = "./pageFlows/identity/otpBind/otpBindO.jsp";
                    else{
                    	$("#msg").html("<i class=\"fa fa-minus-circle\"></i> "+json.errors.msg);
                    	$("#code_img")[0].src="/iaaa/servlet/DrawServlet?Rand="+Math.random();
                    	if("账号未激活"==json.errors.msg){
                    		window.location.href = "https://iaaa.pku.edu.cn/iaaa/activateAccount.jsp?Rand="+Math.random()+"&activeCode="+json.activeCode;
                    	}
                    	else if("用户名错误"==json.errors.msg){
                    		$("#user_name").select();
                    	}
                    }
				},
				error : function(xhr,status,error) {
					//$("#msg").text("查询时出现异常");
					$("#msg").html("<i class=\"fa fa-minus-circle\"></i> 查询时出现异常");
					$("#code_img").attr("src","/iaaa/servlet/DrawServlet?Rand="+Math.random());
				}
			});
   }
}

function resetInput(event){
	var input = $(event.target).parent().prev("input");
	input.val("");
	$(event.target).parent(".i-clear").hide();
	input.focus();
}
