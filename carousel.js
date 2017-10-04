const eventContainer = document.querySelector('.event-container');
const carousel = document.querySelector('.carousel');

events = [];

// Init
getJSON();

function getJSON() {
	fetch('schedule.json')
		.then(resp => resp.json())
		.then(resp => {
			console.log(resp)
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
		carousel.innerHTML += `
			<div class="carousel__item">
				<div class="carousel__time">${event.start} - ${event.end}</div>
				<div class="carousel__text">
					<h2 class="carousel__title ${event.slug ? 'carousel__title--blue' : ''}">${excerpt(event.title)}</h2>
					<p class="carousel__speaker">${event.speaker ? event.speaker : ''}</p>
				</div>
				<div class="carousel__duration">60 min</div>
			</div>
		`;
	});
}