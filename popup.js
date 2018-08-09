
'use strict';

let items = 
	[
		{"name":"item1","number":21,"show":false},
		{"name":"item2","number":5,"show":true},
		{"name":"item3","number":30,"show":false},
	]

function Save(){
	chrome.storage.sync.set({TallyItems: items}, function() {
	  console.log('Value is set to ' + items);
	});
}

function Load(callBack){
	chrome.storage.sync.get(['TallyItems'], function(result) {
	  console.log('Value currently is ' + result.TallyItems);
	  items = result.TallyItems;
	  callBack();
	});
}

function MinusClick(item)
{
	let row = item.target.parentElement.parentElement;
	NumberChange(row, -1);
}

function PlusClick(item)
{
	let row = item.target.parentElement.parentElement;
	NumberChange(row, 1);
}

function NumberChange(row, chnageBy)
{
	items[row.rowIndex].number += chnageBy;

	if(items[row.rowIndex].show)
		chrome.browserAction.setBadgeText({text: items[row.rowIndex].number.toString()});

	row.getElementsByClassName("numberinput")[0].value = items[row.rowIndex].number;

	Save();
}

function SetShow(item)
{
	items.forEach(function(element) {
	  element.show = false;
	});

	Array.from(document.getElementsByClassName("fa-eye")).forEach(
    function(element, index, array) {
        element.classList.remove("selectedItem");
    	}
	)

	let row = item.target.parentElement.parentElement;
	items[row.rowIndex].show = true;
	chrome.browserAction.setBadgeText({text: items[row.rowIndex].number.toString()});

	item.target.classList.add("selectedItem");

	Save();
}

function DeleteItem(ele)
{
	let row = ele.target.parentElement.parentElement;
	items.splice(row.rowIndex, 1);
	row.parentNode.removeChild(row);

	Save();
}

function NewItem(ele)
{
	let newItem = {"name":"New item","number":0,"show":false};
	items.push(newItem);
	AddRow(newItem);
	Save();
}

function EnableInput(ele)
{
	console.log(ele);
	ele.target.readOnly = false;
}

function NameChange(ele)
{
	if (event.keyCode === 13 || event.keyCode === 27)
	{
		let row = ele.target.parentElement.parentElement;
		let item = items[row.rowIndex];

		if (event.keyCode === 13) {
			item.name = ele.target.value;
			Save();
	    } else {
	    	event.preventDefault();
	        ele.target.value = item.name;  
	    }

	    ele.target.readOnly = true;
	}
}

function NumberChange(e)
{
	if (event.keyCode === 13 || event.keyCode === 27)
	{
		let row = e.target.parentElement.parentElement;
		let item = items[row.rowIndex];

		if (event.keyCode === 13)
		{
			let val = e.target.value;

			if(val % 1 == 0)
			{
				item.number = val;
				Save();
			}
			else
			{
				alert("Not a whole number");
				e.target.value = item.number;
			}

	    } else {
	    	event.preventDefault();
	        e.target.value = item.number;  
	    }

	    ele.target.readOnly = true;
	}	
}

function AddRow(item)
{
	let table = document.getElementById("items");

	let row = table.insertRow(table.rows.length);
		row.insertCell(0).innerHTML = '<i class="fas fa-minus-circle"></i>';
		row.insertCell(1).innerHTML = '<input class="nameinput" type="text" readonly="true" value="' + item.name + '">';
     	row.insertCell(2).innerHTML = '<input class="numberinput" type="text" readonly="true" value="' + item.number + '">';
     	row.insertCell(3).innerHTML = '<i class="fas fa-plus-circle"></i> <i class="fas fa-eye '+ (item.show ? 'selectedItem' : '') +'"></i> <i class="fas fa-trash-alt"></i>';

     	row.getElementsByClassName("fa-minus-circle")[0].addEventListener('click', MinusClick);
     	row.getElementsByClassName("fa-plus-circle")[0].addEventListener('click', PlusClick);
     	row.getElementsByClassName("fa-eye")[0].addEventListener('click', SetShow);
		row.getElementsByClassName("fa-trash-alt")[0].addEventListener('click',DeleteItem);

     	let nameInput = row.getElementsByClassName("nameinput")[0];
     	nameInput.addEventListener('dblclick', EnableInput);
     	nameInput.addEventListener('keydown', NameChange);
}

document.addEventListener('DOMContentLoaded', function () {

	document.getElementById("NewItemButton").addEventListener('click',NewItem);

	Load(function(){
		for (let i = 0; i < items.length; i++) 
		{
			AddRow(items[i]);
		}
	});

});


