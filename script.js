let expenseArr = getExpense(); // if local storage has expense data stored, populate expenseArr with stored data
let sumArray = getTotal(); // if local storage has total data stored, populate sumArray to stored data

const addExpense = document.getElementById("expensePrint");
const addSum = document.getElementById("totalSum");
const calcTotal = (a, b) => a + b;

//load and populate tabel w/ data saved in local storage
document.getElementById("expenseForm").onload = () => {
	loadExpData();
};
//add data to table and store data in local storage
document.getElementById("expenseForm").onsubmit = (e) => {
	e.preventDefault();
	submitExpense();
};

//***** FUNCTIONS ******

//creates local storage keys with empty arrays for "total" and "expenses"
function createLocalContainers() {
	if (localStorage.getItem("total") === null) {
		localStorage.setItem("total", JSON.stringify([]));
	}

	if (localStorage.getItem("expenses") === null) {
		localStorage.setItem("expenses", JSON.stringify([]));
	}
}

function addHtml(arr) {
	addExpense.innerHTML += `
                <tr>
                    <td>${arr.date}</td>
                    <td><span>$</span>${numberWithCommas(arr.amount.toFixed(2))}</td>
                    <td style="word-wrap: break-word;max-width: 160px;">${arr.category}</td>
                    <td style="word-wrap: break-word;max-width: 160px;">${
						arr.description
					}<span class="close" onclick="delRow(this)">&#x2716;</span></td>

                </tr>
                                `;
}
function updateTotal() {
	addSum.innerHTML = `<span>$</span> ` + numberWithCommas(sumArray.reduce(calcTotal, 0).toFixed(2));
}

//function to reformat the amount and total so that they are seperated by commas at the thousands
function numberWithCommas(x) {
	return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}
//function to reformat the date from yyyy-mm-dd to mm/dd/yyyy
function formatDate(input) {
	let pattern = /(\d{4})\-(\d{2})\-(\d{2})/;
	if (!input || !input.match(pattern)) {
		return null;
	}
	return input.replace(pattern, "$2/$3/$1");
}
// saves the total from SumArray into local storage
function saveTotal() {
	localStorage.setItem("total", JSON.stringify(sumArray));
}
//returns the saved total from local storage
function getTotal() {
	return JSON.parse(localStorage.getItem("total"));
}
// saves the data from expenseArr into local storage
function saveExpense() {
	localStorage.setItem("expenses", JSON.stringify(expenseArr));
}
// returns the saved expense array data from local storage
function getExpense() {
	return JSON.parse(localStorage.getItem("expenses"));
}
//function to handle the submit expense button - populates table with form data and saves to local storage
function submitExpense() {
	let expense = {
		date: formatDate(document.getElementById("date").value),
		amount: parseFloat(document.getElementById("amount").value),
		category: document.getElementById("category").value,
		description: document.getElementById("description").value,
	};

	// handles if there is no data in local storage it sets expenseArr to an empty array.  Otherwise expenseArr is null and can't call push method
	if (expenseArr === null) {
		expenseArr = [];
	}
	expenseArr.push(expense);
	saveExpense();
	for (let i = 0; i < expenseArr.length; i++) {
		if (expenseArr.length === i + 1) {
			// handles if there is no data in local storage it sets sumArray to an empty array.  Otherwise sumArray is null and can't call push method
			if (sumArray === null) {
				sumArray = [];
			}
			sumArray.push(expenseArr[i].amount);
			updateTotal();
			addHtml(expenseArr[i]);
		}
	}
	saveTotal();

	document.querySelector("form").reset();
}
// this function runs when the page is loaded to pull from local storage the saved data of both the keys total & expenses.  Displays saved/stored data in table.
function loadExpData() {
	//if first time loading and there is no local storage, call creatLocalContainers function
	if (expenseArr === null && sumArray === null) {
		createLocalContainers();
	} else {
		for (let i = 0; i < expenseArr.length; i++) {
			updateTotal();
			addHtml(expenseArr[i]);
		}
	}
}

//function that runs when the X is pressed to delete the row and update local storage
function delRow(x) {
	let p = x.parentNode.parentNode;
	//removes data from expArray and sumArray & updates local storage
	expenseArr.splice(p.rowIndex - 1, 1);
	sumArray.splice(p.rowIndex - 1, 1);
	saveExpense();
	saveTotal();
	//deletes row from table
	p.parentNode.removeChild(p);
	//redisplays new sum Total
	document.getElementById("totalSum").innerHTML =
		`<span>$</span> ` + numberWithCommas(sumArray.reduce(calcTotal, 0).toFixed(2));
}
