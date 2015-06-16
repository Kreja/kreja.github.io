window.onload = main;

function main()
{
	var oBtns = document.getElementsByTagName("button");
	var oRes = document.getElementById("res");
	var oComputerChoiceImg = document.getElementById("computerChoiceImg");
	var oUserChoiceImg = document.getElementById("userChoiceImg");
	
	for(var i=0; i<oBtns.length; i++)
	{
		oBtns[i].value = i;
	}

	for(var i=0; i<oBtns.length; i++)
	{
		oBtns[i].onclick = function()
		{	
			oComputerChoiceImg.src="img/q-mark.jpg";
			oUserChoiceImg.src="img/q-mark.jpg";
			count();
			setTimeoutMy(this, game, 1500);
		}
	}

	var count = function()
	{
		var i = 3;
		counter = function()
		{
			oRes.innerHTML = i--;
			if(i<=0) clearInterval(timer);	
		};
		counter();
		var timer = setInterval( counter,500);
	};
	
	var setTimeoutMy = function(obj, fn, time)
	{
		setTimeout(function(){fn(obj);}, time);
	};
	
	var game = function(oUserChoice)
	{
		var oItems = ["rock", "scissors", "paper"];
		oUserChoice.name = "You";
		
		var oComputerChoice = new Object();
		oComputerChoice.name="computer";
		oComputerChoice.value = Math.floor(Math.random()*9/3);
		
		show(oComputerChoiceImg,oComputerChoice.value);
		show(oUserChoiceImg,oUserChoice.value);
		
		oRes.innerHTML = compare(oUserChoice, oComputerChoice);
	};

	var show = function(obj, value)
	{
		obj.src = "img/"+value.toString()+".png";
	};

	var compare = function(obj1, obj2)
	{
		if(obj1.value == obj2.value)
		{
			return "Tie!";
		}
		else if((obj1.value+1)%3 == obj2.value)	//前面的会赢
		{
			return obj1.name + " win!!!";
		}
		else if((obj2.value+1)%3 == obj1.value)
		{
			return obj1.name + " lose...";
		}
	};
};