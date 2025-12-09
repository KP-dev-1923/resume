(function(){
	const feedbacks = [
		{ name: 'Henry de Waziers - Senior Project Manager', avatar: 'ab_files/images/users/Henry.jpeg', quote: 'At Fidesio, We worked together on several projects. Khoa was a great asset to the team. He is a very talented developer and a great team leader.', link: 'https://www.linkedin.com/in/henry-de-waziers-868aa099/' },
		{ name: 'Albert Nhat-anh Tran - Professional Scrum Master', avatar: 'ab_files/images/users/AnhTran.jpeg', quote: 'Khoa is someone who is very dedicated to his work and willing to help others.', link: 'https://www.linkedin.com/in/albert-nhatanh-tran/' },
		{ name: 'KOJI SUGANO - ラクスル （ダンボールワン事業）', avatar: 'ab_files/images/users/KOJI.jpeg', quote: 'He works hard, is serious, is very aware of etiquette and polite.', link: 'https://www.linkedin.com/in/kojisugano/' },
		{ name: 'Keiran James - Co-founder at Business Sales Platform', avatar: 'ab_files/images/users/Keiran.png', quote: 'Khoa is a great developer & problem solver and has been a great asset to our team.', link: 'https://www.linkedin.com/in/keiran-james-/' },
	];

	const track = document.getElementById('cfTrack');
	if(!track) return;

	function createCard(item){
		const card = document.createElement('div');
		card.className = 'cf-card';
		card.setAttribute('role','listitem');

		const inner = document.createElement('div');
		inner.className = 'cf-inner';

		const img = document.createElement('img');
		img.className = 'cf-avatar';
		img.src = item.avatar;
		img.alt = item.name;

		const textWrap = document.createElement('div');
		const quote = document.createElement('p');
		quote.className = 'cf-quote';
		quote.textContent = `“${item.quote}”`;
		const name = document.createElement('p');
		name.className = 'cf-name';
		name.appendChild(document.createTextNode('— '));
		if(item.link){
			const a = document.createElement('a');
			a.href = item.link;
			a.target = '_blank';
			a.rel = 'noopener noreferrer';
			a.textContent = item.name;
			name.appendChild(a);
		} else {
			const span = document.createElement('span');
			span.textContent = item.name;
			name.appendChild(span);
		}

		textWrap.appendChild(quote);
		textWrap.appendChild(name);
		inner.appendChild(img);
		inner.appendChild(textWrap);
		card.appendChild(inner);
		return card;
	}

	feedbacks.forEach(f => track.appendChild(createCard(f)));

	let index = 0;
	function goTo(i){
		index = (i + feedbacks.length) % feedbacks.length;
		track.style.transform = `translateX(-${index * 100}%)`;
	}

	let timer = setInterval(()=>{ goTo(index + 1); }, 10000);
	function resetTimer(){ clearInterval(timer); timer = setInterval(()=>{ goTo(index + 1); }, 10000); }

	const prevBtn = document.querySelector('#clientsFeedback .cf-prev');
	const nextBtn = document.querySelector('#clientsFeedback .cf-next');
	if(prevBtn) prevBtn.addEventListener('click', ()=>{ goTo(index - 1); resetTimer(); });
	if(nextBtn) nextBtn.addEventListener('click', ()=>{ goTo(index + 1); resetTimer(); });
})();
