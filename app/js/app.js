class Car {
	constructor() {
	}


	//getting data with async await
	async getCarsAsync() {
		const carResponse = await fetch(`http://www.json-generator.com/api/json/get/bQJcQFdAGG?indent=4`);


		const cars = await carResponse.json();

		return {
			cars
		}
	}

	showCars(data) {
		let listCar = '';
		let output = data.forEach((el, ind) => {

			listCar += `
			<li  class="car-list__item">
				<label>
					<h2><input type="checkbox" class="car-list__checkbox">${el.name}</h2>
					<div class="car-list__img">
						<img src="${el.image}" alt="">
					</div>
				</label>
			</li>`
		});
		return listCar;
	}
}

let allCars = [];


let carListWrapper = document.getElementById('car-list');
let searchInput = document.getElementById('car-filter');
let domCarNodes, checkboxes;
let checkedCars = [];
let raceCars = [];
let startButton = document.getElementById('start-button');
let resetButton = document.getElementById('reset-button');
let tableBody = document.getElementById('table-body');
let medals = ['gold', 'silver', 'bronze'];
const carList = new Car();
const roadLength = 50;
let longestTime = 0;

carList.getCarsAsync().then(res => {
	allCars = res.cars.data;
	carListWrapper.innerHTML = carList.showCars(res.cars.data);
	searchInput.removeAttribute('disabled');

	domCarNodes = document.querySelectorAll('.car-list__item');

	checkboxes = document.querySelectorAll('input[type="checkbox"]');

	checkboxes.forEach((el, ind) => {


		el.addEventListener('change', function () {

			resetRace(); //reset race

			if(this.checked) {
				checkedCars.push(allCars[ind]);
				console.log("checked ",  allCars[ind].name);
				addCar(allCars[ind]);
			}
			else {

				var found = checkedCars.findIndex(function(el) {
				  	return el.id == allCars[ind].id;
				});
				checkedCars.splice(found, 1);
				console.log("unchecked ",  allCars[ind].name);
				removeCar(allCars[ind]);
			}
			
			console.log(checkedCars.length);
			if(checkedCars.length > 0) {
				startButton.classList.add('show');
			}
			else {
				startButton.classList.remove('show');
			}
		});
	});
});

let inputStr = '';
searchInput.addEventListener('keyup', function() {

	inputStr = searchInput.value.toLowerCase();
	console.log(domCarNodes);
	domCarNodes.forEach(el => {
		if(el.innerText.toLowerCase().indexOf(inputStr) > -1) {
			// console.log(el.innerText);
			el.classList.remove('disabled')
		}
		else {
			el.classList.add('disabled')
		}
	})
});

let addCar = function(car){
	var output = `
		<tr id="${car.id}">
			<td class="car-race__block"><div><img id="img${car.id}" src="${car.image}" alt=""></div></td>
		</tr>
	`
	tableBody.insertAdjacentHTML( 'beforeend', output);

	var currentTime = ((roadLength / car.speed) * 10).toFixed(2);
	document.getElementById('img' + car.id).style.transitionDuration = currentTime + 's';

	if(longestTime < currentTime) {
		longestTime = currentTime;
	}
}

let removeCar = function(car) {
	var element = document.getElementById(car.id);

	if( element ) {
		element.remove();
	}
}

startButton.addEventListener('click', function () {
	raceCars = checkedCars.slice(0, checkedCars.length);

	raceCars.sort(function (a, b) {
		return b.speed - a.speed;
	});
	var medalCars = 0;
	if(raceCars.length > 3) {
		medalCars = 3;
	}
	else {
		medalCars = raceCars.length;
	}

	setTimeout(function () {
		for (var i = 0; i < medalCars; i++) {
			document.getElementById(raceCars[i].id).classList.add(medals[i]);

		}
	}, longestTime*1000)

	startRace();
	// setTimeout(function () {
	// }, 500)

	// console.log(raceCars);

});

let resetRace = function() {
	if(document.querySelector('.gold')) {
		document.querySelector('.gold').classList.remove('gold');
	}
	if(document.querySelector('.silver')) {
		document.querySelector('.silver').classList.remove('silver');
	}
	if(document.querySelector('.bronze')) {
		document.querySelector('.bronze').classList.remove('bronze');
	}
	if(document.querySelector('.car-race')) {
		document.querySelector('.car-race').classList.remove('start');
	}
	startButton.classList.add('show');
	resetButton.classList.remove('show');
}

let startRace = function() {
	document.querySelector('.car-race').classList.add('start');
	resetButton.classList.add('show');
	startButton.classList.remove('show');
	longestTime = 0;
}

resetButton.addEventListener('click', function () {
	resetRace();
});
