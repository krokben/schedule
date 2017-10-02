const eventContainer = document.querySelector('.event-container');

const events = [
	{
		id: 1,
		day: 1,
		type: 'misc',
		start: '09:00',
		end: '09:30',
		duration: 30,
		title: 'Registration + Coffee'
	},
	{
		id: 2,
		day: 1,
		type: 'misc',
		start: '09:30',
		end: '09:40',
		duration: 10,
		title: 'Opening'
	},
	{
		id: 3,
		day: 1,
		type: 'talk',
		start: '09:40',
		end: '10:10',
		duration: 30,
		title: 'Keynote: The State of JavaScript',
		speaker: 'Sacha Greif'
	},
	{
		id: 4,
		day: 1,
		type: 'talk',
		start: '10:10',
		end: '11:10',
		duration: 60,
		title: '5 Architectures of Asynchronous JavaScript',
		speaker: 'Tomasz Ducin'
	},
	{
		id: 5,
		day: 1,
		type: 'misc',
		start: '11:10',
		end: '11:25',
		duration: 15,
		title: 'Break'
	},
	{
		id: 6,
		day: 1,
		type: 'talk',
		start: '11:25',
		end: '11:55',
		duration: 30,
		title: 'Best Practices for GraphQL and GraphQL Subscriptions at Scale',
		speaker: 'Laney Kuenzel Zamore & Adam Kramer'
	},
	{
		id: 7,
		day: 1,
		type: 'talk',
		start: '11:55',
		end: '12:10',
		duration: 15,
		title: 'Sociolinguistics and the JavaScript Community: A Love Story',
		speaker: 'Harriet Lawrence'
	},
	{
		id: 8,
		day: 1,
		type: 'lightning',
		start: '12:10',
		end: '12:15',
		duration: 5,
		title: 'Lightning Talk: Service Workers, use them',
		speaker: 'Pontus Lundin',
		link: 'https://twitter.com/pontahontas',
		handle: '@pontahontas'
	},
	{
		id: 9,
		day: 1,
		type: 'lightning',
		start: '12:15',
		end: '12:20',
		duration: 5,
		title: 'Lightning Talk: From Citizen Initiative to Government Agency Process and Back Again',
		speaker: 'Johan Öbrink',
		link: 'https://twitter.com/johanobrink',
		handle: '@johanobrink'
	},
	{
		id: 10,
		day: 1,
		type: 'misc',
		start: '12:20',
		end: '13:30',
		duration: 70,
		title: 'Lunch'
	},
	{
		id: 11,
		day: 1,
		type: 'talk',
		start: '13:30',
		end: '14:00',
		duration: 30,
		title: "You're only supposed to blow the bloody doors off!",
		speaker: 'Léonie Watson'
	},
	{
		id: 12,
		day: 1,
		type: 'talk',
		start: '14:00',
		end: '14:30',
		duration: 30,
		title: 'A Brief History of Prototypes',
		speaker: 'Katerina Marchán'
	}
];

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

events.forEach(event => {
	if (event.type === 'misc') {
		eventContainer.innerHTML += `
			<div class="event-misc ${calcSize(event.duration)}">
				<div class="event__time">
					<div class="event__start">${event.start}</div>
					<div class="event__line">|</div>
					<div class="event__end">${event.end}</div>
				</div>
				<div class="event__text">
					<h3 class="event__header">${event.title}</h3>
				</div>
			</div>
		`;
	} else if (event.type === 'talk') {
		eventContainer.innerHTML += `
			<div class="event ${calcSize(event.duration)}">
				<div class="event__time">
					<div class="event__start">${event.start}</div>
					<div class="event__line">|</div>
					<div class="event__end">${event.end}</div>
				</div>
				<div class="event__text">
					<h3 class="event__header event__header--blue">${event.title}</h3>
					<p class="event__speaker">${event.speaker}</p>
				</div>
			</div>
		`;
	} else if (event.type === 'lightning') {
		eventContainer.innerHTML += `
			<div class="event ${calcSize(event.duration)}">
				<div class="event__time">
					<div class="event__start">${event.start}</div>
					<div class="event__line">|</div>
					<div class="event__end">${event.end}</div>
				</div>
				<div class="event__text">
					<h3 class="event__header event__header--blue">${event.title}</h3>
					<p class="event__speaker">${event.speaker}</p>
					<a class="event__link" href="${event.link}">${event.handle}</a>
				</div>
			</div>
		`;
	}
});