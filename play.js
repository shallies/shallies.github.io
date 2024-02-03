var oPlay, oResrc, oDrama;
var ajax;
window.onload=function(){
	if(window.XMLHttpRequest)
		ajax=new XMLHttpRequest();
	else
	{
		ajax=new ActiveXObject("Microsoft.XMLHTTP");
		if(!ajax)ajax=new ActiveXObject("Msxml2.XMLHTTP");
	}

	if(ajax)
	{
		ajax.onreadystatechange=processPlay;

		ajax.open("GET","play.lst",true);
		ajax.setRequestHeader("Content-Type","text/plain; charset=utf-8");
		ajax.setRequestHeader("Cache-Control","no-cache");
		ajax.send();
	}
}

function processPlay()
{
	if(ajax.readyState == 4 && ajax.status == 200)
	{
		try
		{
			var vHTML="", vIndex=0;
			oPlay=JSON.parse(ajax.responseText);
			oResrc=document.getElementById("oResource");
			cur=getCookie("oResource");
			for(var i=0;i<oPlay.resource.length;i++)
				if(cur==oPlay.resource[i].name)
					vHTML+='<option value="'+oPlay.resource[i].url+'" selected>'+oPlay.resource[i].name+'</option>';
				else
					vHTML+='<option value="'+oPlay.resource[i].url+'">'+oPlay.resource[i].name+'</option>';
			oResrc.innerHTML=vHTML;

			oDrama=document.getElementById("oDrama");
			cur=getCookie("oDrama");
			vHTML="";
			for(var i=0;i<oPlay.drama.length;i++)
				if(cur==oPlay.drama[i].name)
				{
					vHTML+='<option value="'+i+'" selected>'+oPlay.drama[i].name+'</option>';
					cur=getCookie(oPlay.drama[i].name);
					vIndex=i;
				}
				else
					vHTML+='<option value="'+i+'">'+oPlay.drama[i].name+'</option>';
			oDrama.innerHTML=vHTML;
			changeDrama();
		}
		catch(err){}
	}
}

function changeResource()
{
	for(var i=0; i<oResrc.length; i++)
	{
		if(oResrc[i].selected)
		{
			setCookie(oResrc.id, oResrc[i].innerText);
			return;
		}
	}
}

function changeDrama()
{
	var vHTML="", cur="", vIndex=0;
	for(var i=0; i<oDrama.length; i++)
	{
		if(oDrama[i].selected)
		{
			setCookie(oDrama.id, oDrama[i].innerText);
			cur=getCookie(oDrama[i].innerText);
			vIndex=i;
			break;
		}
	}

	for(var i=0;i<oPlay.drama[vIndex].episode.length;i++)
	{
		if(i%3==0)vHTML+="<tr>";
		vHTML+='<td><a id="LNK'+i+'" href="'+oPlay.drama[vIndex].episode[i].url+'" onclick="naviLink(this);return false;"'+(cur=='LNK'+i?'class="current"':'')+'>'+oPlay.drama[vIndex].episode[i].title+'</a></td>';
		if(i%3==2)vHTML+="</tr>";
	}
	if(i%3==2)vHTML+="</tr>";
	if(vHTML!="")vHTML="<table>"+vHTML+"</table>"
	document.all.LNK.setAttribute("base", oPlay.drama[vIndex].base);
	document.all.oEpisode.innerHTML=vHTML;
}

function setCookie(cName, cValue)
{
	var nDays=60;
	var d = new Date();
	d.setTime(d.getTime()+(nDays*24*60*60*1000));
	var vExpires = "expires="+d.toGMTString();
	document.cookie = cName + "=" + cValue + "; " + vExpires;
}

function getCookie(cName)
{
	var vName = cName + "=";
	var ca = document.cookie.split(';');
	for(var i=0; i<ca.length; i++)
	{
		var c = ca[i].trim();
		if(c.indexOf(vName)==0)return c.substring(vName.length,c.length);
	}
	return "";
}

function naviLink(oLink)
{
	var sDrama=""
	for(var i=0; i<oDrama.length; i++)
	{
		if(oDrama[i].selected)
		{
			sDrama=oDrama[i].innerText;
			break;
		}
	}

	try
	{
		var id=getCookie(sDrama);
		if(id!="")document.getElementById(id).classList.remove("current");

		oLink.classList.add("current");
		setCookie(sDrama, oLink.id);

		document.all.LNK.href=document.all.oResource.value+document.all.LNK.getAttribute("base")+oLink.getAttribute("href");
		document.all.LNK.click();
	}
	catch(err){}
}
