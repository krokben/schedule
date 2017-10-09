const scrollBox = document.querySelector('.scroll-box');
const eventContainer = document.querySelector('.event-container');
const carousel = document.querySelector('.carousel');
let xDown = null;
let yDown = null;

let renderedEvent;
let events = [];

// Init
getJSON();

// Event Listeners
carousel.addEventListener('click', handleClick);
scrollBox.addEventListener('touchstart', handleTouchStart, false);
scrollBox.addEventListener('touchmove', handleTouchMove, false);


function handleClick(e) {
	for (let el of carousel.querySelectorAll('.carousel__item--zoom')) {
		el.classList.remove('carousel__item--zoom');
	}

	if (e.target.classList.contains('carousel__item')) {
		if (!e.target.classList.contains('carousel__item--zoom')) {
			e.target.classList.add('carousel__item--zoom');
			fetchEvent(e.target.dataset.id);
			scrollerCoaster(e.target);
		}
	} else if (e.target.classList.contains('carousel__title') || e.target.classList.contains('carousel__speaker')) {
		if (!e.target.parentElement.parentElement.classList.contains('carousel__item--zoom')) {
			e.target.parentElement.parentElement.classList.add('carousel__item--zoom');
			fetchEvent(e.target.parentElement.parentElement.dataset.id);
			scrollerCoaster(e.target.parentElement.parentElement);
		}
	} else if (e.target.classList.contains('carousel__time') || e.target.classList.contains('carousel__duration')) {
		if (!e.target.parentElement.classList.contains('carousel__item--zoom')) {
			e.target.parentElement.classList.add('carousel__item--zoom');
			fetchEvent(e.target.parentElement.dataset.id);
			scrollerCoaster(e.target.parentElement);
		}
	}
}

function scrollerCoaster(targetcoon) {
	const x = carousel.clientWidth;
	const y = 100;
	const z = targetcoon.id.replace('carouselItem', '');
	const scrollL = Math.max(0, (y * z) - (x - y)/2 + 14);
	$('.carousel').stop().animate({scrollLeft: scrollL}, 200, 'linear');
}

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

function fetchEvent(id) {
	fetch('schedule.json')
		.then(resp => resp.json())
		.then(resp => {
			renderEvent(resp.find(event => event.id == id));
			// setInterval(
			// 	() => {
			// 		now = new Date();
			// 		render('7');
			// 	}, 30000);
		})
	;
}

function getJSON() {
	fetch('schedule.json')
		.then(resp => resp.json())
		.then(resp => {
			events = resp;
			const event = events.find(event => event.slug === getUrlParameter('event'));
			events = events.filter(evt => evt.day === event.day);
			renderCarousel(event.day);
			renderEvent(event);
			const element = document.querySelector(`[data-id='${event.id}']`);
			element.classList.add('carousel__item--zoom')
			scrollerCoaster(element);
			// setInterval(
			// 	() => {
			// 		now = new Date();
			// 		render('7');
			// 	}, 30000);
		})
	;
}

function excerpt(title) {
	if (title.length > 40) {
		const slice = title.slice(0, 40);
		const array = slice.split(' ');
		array.pop();
		array.push('...');
		return array.join(' ');
	}

	return title;
}

function renderCarousel(day) {
	carousel.innerHTML = '';
	events.filter(evt => evt.day === day).forEach((evt, i) => {
		carousel.innerHTML += `
			<div id="carouselItem${i}" class="carousel__item" data-id=${evt.id}>
				<div class="carousel__time">${evt.start}${evt.end ? ' - ' + evt.end : ''}</div>
				<div class="carousel__text">
					<h2 class="carousel__title ${evt.slug ? 'carousel__title--blue' : ''}">${excerpt(evt.title)}</h2>
					<p class="carousel__speaker">${evt.speaker ? evt.speaker : ''}</p>
				</div>
				<div class="carousel__duration">${evt.duration ? evt.duration + ' min' : ''}</div>
			</div>
		`;
		window[`carouselItem${i}`] = carousel.querySelector(`#carouselItem${i}`);
	});
}

function renderEvent(event) {
	console.log(event.id)
	renderedEvent = event;
	eventContainer.innerHTML = `
		<a class="back" href="index.html"><i class="fa fa-chevron-left" aria-hidden="true"></i></a>
		<div class="speaker-container"> 
			<div class="speaker-container__portrait">
				${event.img ? `<img class="speaker-container__img" src="assets/images/${event.img}.png" />` : ''}	
			</div>
			<div class="speaker-container__text">
				<div>
					<p class="speaker-container__name">${event.speaker ? event.speaker : ''}</p>
					<p class="speaker-container__description">
						${event.description ? event.description : ''}
					</p>
				</div>
			</div>
		</div>
		<h1 class="${!event.speaker ? 'speaker-container__title' : ''}">${event.title}</h1>
		<p class="event-container__time">${event.start} ${event.end ? ' - ' + event.end : ''} ${event.duration ? '(' + event.duration + ' min)': ''}</p>
		<p class="event-container__paragraph">
			${event.text ? event.text : ''}
		</p>
	`;
}

function handleTouchStart(evt) {
	xDown = evt.touches[0].clientX;
};

function handleTouchMove(evt) {
	if (!xDown) {
		return;
	}

	let xUp = evt.touches[0].clientX;

	let xDiff = xDown - xUp;

	console.log(xDiff)
	if (xDiff > 10) {
		/* left swipe */
		const newEvent = events.find(e => e.id == Number(renderedEvent.id) + 1);

		if (newEvent.id > events.length - 1) return;

		const el = document.querySelector('.carousel__item--zoom');
		const nextSibling = el.nextElementSibling;

		renderEvent(newEvent);
		scrollerCoaster(nextSibling);
		el.classList.remove('carousel__item--zoom');
		nextSibling.classList.add('carousel__item--zoom');
	} else if (xDiff < -10) {
		/* right swipe */
		const newEvent = events[events.indexOf(renderedEvent)-1];

		if (newEvent.id < events[0].id) return;
		
		const el = document.querySelector('.carousel__item--zoom');
		const previousSibling = el.previousElementSibling;

		scrollerCoaster(previousSibling);
		renderEvent(newEvent);
		el.classList.remove('carousel__item--zoom');
		previousSibling.classList.add('carousel__item--zoom');
	}
	/* reset values */
	xDown = null;
};