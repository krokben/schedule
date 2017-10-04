const eventContainer = document.querySelector('.event-container');
const carousel = document.querySelector('.carousel');

events = [];

// Init
getJSON();

// Event Listeners
carousel.addEventListener('click', handleClick);

function handleClick(e) {
	for (let el of carousel.querySelectorAll('.carousel__item--zoom')) {
		el.classList.remove('carousel__item--zoom');
	}

	if (e.target.classList.contains('carousel__item')) {
		if (!e.target.classList.contains('carousel__item--zoom')) {
			e.target.classList.add('carousel__item--zoom');
		}
	} else if (e.target.classList.contains('carousel__title') || e.target.classList.contains('carousel__speaker')) {
		if (!e.target.parentElement.parentElement.classList.contains('carousel__item--zoom')) {
			e.target.parentElement.parentElement.classList.add('carousel__item--zoom');
		}
	} else if (e.target.classList.contains('carousel__time') || e.target.classList.contains('carousel__duration')) {
		if (!e.target.parentElement.classList.contains('carousel__item--zoom')) {
			e.target.parentElement.classList.add('carousel__item--zoom');
		}
	} 
}

function getJSON() {
	fetch('schedule.json')
		.then(resp => resp.json())
		.then(resp => {
			events = resp;
			render('7');
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

function render(day) {
	eventContainer.innerHTML = '';
	events.filter(event => event.day === day).forEach(event => {
		eventContainer.innerHTML += `
			<div class="scroll-box">
				<main class="event-container">
					<div class="speaker-container"> 
						<div class="speaker-container__portrait">
							<img class="speaker-container__img" src="assets/images/${event.img}.png" />		
						</div>
						<div class="speaker-container__text">
							<div>
								<p class="speaker-container__name">${event.speaker}</p>
								<p class="speaker-container__description">
									Creator of Sidebar, The State of JavaScript & more
								</p>
							</div>
						</div>
					</div>
					<h1>${event.title}</h1>
					<p class="event-container__paragraph">
						${event.text}
					</p>
				</main>
			</div>
		`;
	}
	carousel.innerHTML = '';
	events.filter(event => event.day === day).forEach(event => {
		carousel.innerHTML += `
			<div class="carousel__item">
				<div class="carousel__time">${event.start} - ${event.end}</div>
				<div class="carousel__text">
					<h2 class="carousel__title ${event.slug ? 'carousel__title--blue' : ''}">${excerpt(event.title)}</h2>
					<p class="carousel__speaker">${event.speaker ? event.speaker : ''}</p>
				</div>
				<div class="carousel__duration">${event.duration} min</div>
			</div>
		`;
	});
}