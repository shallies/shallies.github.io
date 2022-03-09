var ajax;
if(window.XMLHttpRequest)
	ajax=new XMLHttpRequest();
else
{
	ajax=new ActiveXObject("Microsoft.XMLHTTP");
	if(!ajax)ajax=new ActiveXObject("Msxml2.XMLHTTP");
}

if(ajax)
{
	ajax.onreadystatechange=function()
	{
		if(ajax.readyState == 4 && ajax.status == 200)
		{
			try
			{
				var vList=ajax.responseText.split(/[\r\n]+/);
				var vHTML="", vLine, vIndex=0;

				var idCur=getCookie(document.all.oName.value);
				for(var i=1; i<vList.length; i++)
				{
					vLine=vList[i].split(",");
					if(vLine.length==2)
					{
						if(i%3==1)vHTML+="<tr>";
						vHTML+="<td><a id=\"LNK"+vIndex+"\" href=\""+vLine[1]+"\" onclick=\"naviLink(this);return false;\""+(idCur=="LNK"+vIndex?"class=\"current\"":"")+">"+vLine[0]+"</a></td>";
						if(i%3==0)vHTML+="</tr>";
						vIndex++;
					}
				}
				if(vHTML!="")vHTML="<table>"+vHTML+"</table>"

				document.all.LNK.setAttribute("base", vList[0]);
				document.all.oList.innerHTML=vHTML;
			}
			catch(err){}
		}
	}
}

function changeName(oSel)
{
	if(oSel)
		setCookie(oSel.id, oSel.value);
	else
		oSel=document.all.oName;

	ajax.open("GET","play/"+oSel.value,true);
	ajax.setRequestHeader("Content-Type","text/plain; charset=utf-8");
	ajax.setRequestHeader("Cache-Control","no-cache");
	ajax.send();
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
function initSelection(oSel)
{
	var sVal=getCookie(oSel.id);
	if(sVal!="")
		for(var i=0;i<oSel.length;i++)
			if(oSel[i].value==sVal)
			{
				oSel[i].selected = true;
				return;
			}

	oSel[0].selected=true;
}
function naviLink(oLink)
{
	try
	{
		var id=getCookie(document.all.oName.value);
		if(id!="")document.getElementById(id).classList.remove("current");

		oLink.classList.add("current");
		setCookie(oName.value, oLink.id);

		document.all.LNK.href=document.all.oSource.value+document.all.LNK.getAttribute("base")+oLink.getAttribute("href");
		document.all.LNK.click();
	}
	catch(err){}
}

initSelection(document.all.oSource);
initSelection(document.all.oName);
changeName();
