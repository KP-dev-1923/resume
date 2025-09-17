(function(){
	const projects = [
		{ id:1, title:"Fuel Management Platform", description:"FuelCloud is a fuel technology company that builds fuel management systems designed for the future of business. The platform combines flexible, light‑weight hardware with powerful cloud software that gives managers real‑time data to make better decisions about their fuel.", image:"./ab_files/images/sites/fuelcloud.png", problems:"Paper logs and manual reconciliation; unauthorized dispensing/shrink; no real‑time visibility across sites; compliance/reporting overhead; difficult integrations.", solutions:"Cloud platform with mobile pump authorization and on‑pump controller; granular roles & access control; real‑time monitoring and alerts; automated reports & exports; open APIs and integrations for ERP/accounting; multi‑site management.", achievements:"Deployed to organizations managing large distributed fleets and sites; billions of gallons tracked globally; customers report improved control, reduced shrink, and less admin time.", features:["Mobile app pump authorization (iOS/Android)", "Role‑based access control & driver/vehicle IDs", "Real‑time dashboards, usage history & alerts", "Automated reports & CSV/email exports", "Hardware controller works with most pumps; offline caching for low connectivity", "Inventory tracking & tank reconciliation", "Multi‑site management with centralized controls", "REST API & integrations"], tech:["Node.js", "ReactJS", "Postgres", "Redis", "Kubernetes", "PHP", "Docker", "Stripe", "Restful API", "AWS"], links:[ {label:"Live site", url:"https://fuelcloud.com/"} ] },
		{ id:2, title:"Konnect — Satellite Internet", description:"High‑speed satellite Internet for homes, SMEs and businesses across Africa, Europe and Russia.", image:"./ab_files/images/sites/konnect.jpg", problems:"Remote and underserved areas lack affordable, reliable broadband; terrestrial rollout costly and slow.", solutions:"High‑speed satellites with simple dish + box install, no landline; offers delivered directly or via local partners.", achievements:"Operating across Africa, Europe and Russia leveraging 40+ years of Eutelsat expertise; helping bridge the digital divide.", features:["Up to 50 Mbps plans","Home & Pro offers","Wide coverage within footprint","No landline needed"], tech:["Drupal", "Laravel", "Stripe API", "Zuora API", "Salesforce API", "Google API", "Restful API", "AWS", "SEO", "CI/CD", "Docker compose"], links:[ {label:"Live site", url:"https://konnect.com/"} ] },
		{ id:3, title:"transportme™ — Bus Operations Platform", description:"Patented ticketing, reporting and vehicle tracking for bus operators, schools and governments.", image:"./ab_files/images/sites/transportme.png", problems:"Fare evasion and manual reconciliation; limited fleet visibility; driver compliance and reporting burden.", solutions:"Smartcard cashless payments, GPS live tracking and passenger app, driver compliance, Clear‑of‑Bus check, reporting suite, flexible ticketing, TVM & push‑to‑talk.", achievements:"ISO 27001 & 9001; used by 1,000+ schools and bus companies since 2013 across AU/NZ/South Pacific.", features:["Smartcard ticketing & top‑ups","GPS live tracking & passenger app","Driver compliance & Clear‑of‑Bus","Comprehensive reporting & exports","Vehicle maintenance (TVM)","Push‑to‑talk"], tech:["CI/CD", "Docker compose", "Laravel", "ReactJS", "VueJS", "Google API", "Stripe API"], links:[ {label:"Live site", url:"https://transportme.com.au/"} ] },
		{ id:4, title:"NatureEye — Remote Drone Tours", description:"Fly a remote drone on a guided tour over iconic landscapes and wildlife while supporting conservation.", image:"./ab_files/images/sites/natureeye.jpg", problems:"Travel barriers and environmental disturbance from on‑site tourism.", solutions:"Live remote piloting with on‑site copilot, browser streaming & scheduling, with revenue sharing to conservation.", achievements:"Five‑star reviews; up to 50% of ticket supports conservation; expanding global locations.", features:["Live remote control with copilot","Guided flights & education","Online booking & scheduling","Team/classroom experiences"], tech:["WebRTC Streaming", "NodeJS", "Express", "NextJS", "Sendgrid", "Zendesk", "Google API"], links:[ {label:"Live site", url:"https://www.natureeye.com/"} ] },
		{ id:5, title:"RAKSUL Group — Internet x Traditional Industries", description:"Platforms modernizing printing, advertising, logistics and corporate IT in Japan.", image:"./ab_files/images/sites/raksul.png", problems:"Fragmented, analog workflows with opaque pricing in legacy industries.", solutions:"Marketplaces and SaaS digitizing workflows, connecting supply/demand and bringing transparency.", achievements:"Multiple businesses (Raksul, Novasell, Hakobel, Josys); ISO 27001; recognized industry impact.", features:["Online printing marketplace","Advertising/marketing platform (Novasell)","Logistics platform (Hakobel)","Corporate IT service (Josys)"], tech:["Docker compose", "PHP", "NodeJS", "Ruby on Rails", "ReactJS", "Raksul APIs", "Restful API"], links:[ {label:"Live site", url:"https://corp.raksul.com/"} ] },
		{ id:6, title:"Business Sales Platform", description:"Marketplace connecting business buyers, sellers and brokers across Australia.", image:"./ab_files/images/sites/businesssales.jpg", problems:"Fragmented listings and poor buyer‑seller matching; manual inquiry workflows.", solutions:"Centralized listing platform with advanced filters, confidential inquiries and broker tooling.", achievements:"Trusted by brokers with thousands of listings and growing national reach.", features:["Advanced search & filters","Broker accounts & tools","Confidential inquiries & NDAs","Valuation resources & insights"], tech:["Wordpress", "NodeJS", "NextJS", "NestJS", "AWS", "Bootstrap", "Sendgrid", "Elementor", "Javascript/Jquery", "Stripe API", "Google API", "CI/CD"], links:[ {label:"Live site", url:"https://www.businesssales.com.au/"} ] }
	];

	const grid = document.getElementById('projectsGrid');
	const modalBackdrop = document.getElementById('kpModalBackdrop');
	const closeModalBtn = document.getElementById('kpCloseModalBtn');
	const prevModalBtn = document.getElementById('kpModalPrev');
	const nextModalBtn = document.getElementById('kpModalNext');
	let currentIndex = -1;

	function createCard(p){
		const el = document.createElement('div');
		el.className = 'kp-card';
		el.tabIndex = 0;
		el.setAttribute('role','button');
		el.setAttribute('aria-pressed','false');
		el.dataset.id = p.id;

		const bg = document.createElement('div');
		bg.className = 'kp-bg';
		bg.style.backgroundImage = `url("${p.image}")`;

		const overlay = document.createElement('div');
		overlay.className = 'kp-overlay';

		const title = document.createElement('div');
		title.className = 'kp-title';
		title.textContent = p.title;

		const desc = document.createElement('div');
		desc.className = 'kp-desc';
		desc.textContent = p.description;

		const tagRow = document.createElement('div');
		tagRow.className = 'kp-tag-row';
		const tag = document.createElement('div');
		tag.className = 'kp-tag';
		tag.textContent = p.tech ? p.tech.slice(0,2).join(' • ') : '—';
		tagRow.appendChild(tag);

		overlay.appendChild(title);
		overlay.appendChild(desc);
		overlay.appendChild(tagRow);

		el.appendChild(bg);
		el.appendChild(overlay);

		el.addEventListener('click', ()=> openModal(p.id));
		el.addEventListener('keydown', (e)=>{ if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(p.id); } });

		return el;
	}

	function renderGrid(){
		projects.forEach(p => { grid.appendChild(createCard(p)); });
	}

	function renderModal(p){
		if(!p) return;
		document.getElementById('kpModalTitle').textContent = p.title;
		document.getElementById('kpModalHero').style.backgroundImage = `url("${p.image}")`;
		document.getElementById('kpProblemsText').textContent = p.problems;
		document.getElementById('kpSolutionsText').textContent = p.solutions;
		document.getElementById('kpAchievementsText').textContent = p.achievements;

		const featuresList = document.getElementById('kpFeaturesList');
		featuresList.innerHTML = '';
		p.features.forEach(f => { const li = document.createElement('li'); li.textContent = f; featuresList.appendChild(li); });

		const techList = document.getElementById('kpTechList');
		techList.innerHTML = '';
		p.tech.forEach(t => { const li = document.createElement('li'); li.textContent = t; techList.appendChild(li); });

		document.getElementById('kpProjectDate').textContent = p.date ? `• ${p.date}` : '';

		const linksArea = document.getElementById('kpLinksArea');
		linksArea.innerHTML = '';
		if(p.links && p.links.length){
			p.links.forEach(l => {
				const a = document.createElement('a'); a.href = l.url; a.target='_blank'; a.rel='noopener noreferrer';
				a.textContent = l.label; a.style.display = 'block'; a.style.marginBottom='6px';
				linksArea.appendChild(a);
			});
		} else {
			linksArea.textContent = '—';
		}
	}

	function openModal(id){
		const idx = projects.findIndex(x => x.id === id);
		if(idx === -1) return;
		currentIndex = idx;
		renderModal(projects[currentIndex]);
		modalBackdrop.classList.add('show');
		modalBackdrop.setAttribute('aria-hidden','false');
		document.body.style.overflow = 'hidden';
		closeModalBtn.focus();
	}

	function closeModal(){
		modalBackdrop.classList.remove('show');
		modalBackdrop.setAttribute('aria-hidden','true');
		document.body.style.overflow = '';
		currentIndex = -1;
	}

	modalBackdrop.addEventListener('click', (e)=>{ if(e.target === modalBackdrop) closeModal(); });
	closeModalBtn.addEventListener('click', closeModal);
	document.addEventListener('keydown', (e)=> {
		if(e.key === 'Escape') closeModal();
		if(modalBackdrop.classList.contains('show')){
			if(e.key === 'ArrowLeft'){
				e.preventDefault();
				if(currentIndex !== -1){ currentIndex = (currentIndex - 1 + projects.length) % projects.length; renderModal(projects[currentIndex]); }
			}
			if(e.key === 'ArrowRight'){
				e.preventDefault();
				if(currentIndex !== -1){ currentIndex = (currentIndex + 1) % projects.length; renderModal(projects[currentIndex]); }
			}
		}
	});

	if(prevModalBtn) prevModalBtn.addEventListener('click', ()=>{
		if(currentIndex === -1) return;
		currentIndex = (currentIndex - 1 + projects.length) % projects.length;
		renderModal(projects[currentIndex]);
	});
	if(nextModalBtn) nextModalBtn.addEventListener('click', ()=>{
		if(currentIndex === -1) return;
		currentIndex = (currentIndex + 1) % projects.length;
		renderModal(projects[currentIndex]);
	});

	renderGrid();
})();
