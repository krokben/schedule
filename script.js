const eventContainer = document.querySelector('.event-container');
const day1 = document.querySelector('#day1');
const day2 = document.querySelector('#day2');
// Global Variables
let events = [];
const now = new Date();

// Init
getJSON();

// Event Listeners
day1.addEventListener('click', () => render('7'));
day2.addEventListener('click', () => render('8'));

function getJSON() {
	// fetch('http://krokben.se/schedule/schedule.json')
	// 	.then(resp => resp.json())
	// 	.then(resp => {
	// 		events = resp;
	// 		render('7');
	// 	// 	setInterval(
	// 	// 		() => {
	// 	// 			now = new Date();
	// 	// 			render('7');
	// 	// 		}, 30000);
	// 	})
	// ;
	$.get('schedule.json', (resp) => {
		events = resp;
		render('7');
	});
}

function calcSize(dur) {
	if (dur < 30) {
		return 'event--s';
	} else if (dur < 60) {
		return 'event--m';
	} else if (dur < 230) {
		return 'event--l';
	} else {
		return 'event--xl';
	}
}

function excerpt(title) {
	if (title.length > 75) {
		const slice = title.slice(0, 75);
		const array = slice.split(' ');
		array.pop();
		array.push('...');
		return array.join(' ');
	}

	return title;
}

function hasBeen(event) {
	const start = event.start.split(':');
	const end = event.end.split(':');
	const startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), start[0], start[1]);
	const endTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), end[0], end[1]);


	if (now > endTime && event.day === '7') {
		return 'event--past';
	} else if (now < endTime && now > startTime && event.day === '7') {
		return 'event--current';
	}

	return '';
}


function render(day) {
	eventContainer.innerHTML = '';
	events.filter(event => event.day === day).forEach(event => {
		if (event.type === 'misc') {
			eventContainer.innerHTML += `
				${event.slug ?  `<a href="carousel.html?event=${event.slug}">` : ''}
					<div class="event-misc ${calcSize(event.duration)} ${hasBeen(event)}">
						<div class="event__time">
							<div class="event__start">${event.start}</div>
							${event.end ? '<div class="event__line"></div>' : ''}
							<div class="event__end">${event.end}</div>
						</div>
						<div class="event__text event__text--pink ${hasBeen(event) === 'event--past' ? 'event__header--grey' : ''} ${calcSize(event.duration) === 'event--xl' && event.day !== '8' ? 'event__text--top' : null}">
							<h3 class="event__header">${excerpt(event.title)}</h3>
						</div>
					</div>
				${event.slug ? `</a>` : ''}
			`;
		} else if (event.type === 'talk') {
			eventContainer.innerHTML += `
				${event.slug ?  `<a href="carousel.html?event=${event.slug}">` : ''}
					<div class="event ${calcSize(event.duration)} ${hasBeen(event)} ${event.img ? `event--${event.img}` : null}">
						<div class="event__time">
							<div class="event__start">${event.start}</div>
							${event.end ? '<div class="event__line"></div>' : ''}
							<div class="event__end">${event.end}</div>
						</div>
						<div class="event__text">
							<h3 class="event__header ${hasBeen(event) === 'event--past' ? 'event__header--grey' : 'event__header--blue'}">${excerpt(event.title)}</h3>
							<p class="event__speaker">${event.speaker}</p>
						</div>
					</div>
				${event.slug ? `</a>` : ''}
			`;
		} else if (event.type === 'lightning') {
			eventContainer.innerHTML += `
				${event.slug ?  `<a href="carousel.html?event=${event.slug}">` : ''}
					<div class="event ${calcSize(event.duration)} ${hasBeen(event)}">
						<div class="event__time">
							<div class="event__start">${event.start}</div>
							${event.end ? '<div class="event__line"></div>' : ''}
							<div class="event__end">${event.end}</div>
						</div>
						<div class="event__text">
							<h3 class="event__header ${hasBeen(event) === 'event--past' ? 'event__header--grey' : 'event__header--blue'}">${excerpt(event.title)}</h3>
							<p class="event__speaker">
								${event.speaker}
							</p>
						</div>
					</div>
				${event.slug ? `</a>` : ''}
			`;
		} else if (event.type === 'overlap' && event.day === '7') {
			eventContainer.children[eventContainer.children.length - 1].children[0].innerHTML += `
				${event.slug ?  `<a href="carousel.html?event=${event.slug}">` : ''}
					<div class="event event--overlap ${calcSize(event.duration)} ${hasBeen(event)}">
						<div class="event__time">
							<div class="event__start">${event.start}</div>
							${event.end ? '<div class="event__line"></div>' : ''}
							<div class="event__end">${event.end}</div>
						</div>
						<div class="event__text">
							<h3 class="event__header event__header--blue">${excerpt(event.title)}</h3>
							<p class="event__speaker">${event.speaker}</p>
						</div>
					</div>
				${event.slug ? `</a>` : ''}
			`;
		} else if (event.type === 'overlap' && event.day === '8') {
			eventContainer.children[eventContainer.children.length - 1].children[1].innerHTML += `
				${event.slug ? `<a href="carousel.html?event=${event.slug}">` : ''}
					<div class="event event--overlap ${calcSize(event.duration)} ${hasBeen(event)}">
						<div class="event__time">
							<div class="event__start">${event.start}</div>
							${event.end ? '<div class="event__line"></div>' : ''}
							<div class="event__end">${event.end}</div>
						</div>
						<div class="event__text">
							<h3 class="event__header event__header--blue">${excerpt(event.title)}</h3>
							<p class="event__speaker">${event.speaker}</p>
						</div>
					</div>
				${event.slug ? `</a>` : ''}
			`;
		}
	});

	// Determine which day to render
	if (day === '7') {
		day1.classList.add('days__day--pink');
		day2.classList.remove('days__day--pink');
	} else {
		day2.classList.add('days__day--pink');
		day1.classList.remove('days__day--pink');
	}

	scrollToCurrent(day);
}

function scrollToCurrent(day) {
	if (day !== '7') {
		$('html, body').animate({
			scrollTop: 57,
		});
	} else {
		const offset = $('.event--current').offset();

		offset.top -= 54;

		$('html, body').animate({
			scrollTop: offset.top,
		});
	}
}

$(window).scroll(function () {
	if ($(window).scrollTop() >= 135) {
		$('.fixed-header').addClass('fixed');
		$('.event-container').addClass('event-container--margin');
	}
	else {
		$('.fixed-header').removeClass('fixed');
		$('.event-container').removeClass('event-container--margin');
	}
});
