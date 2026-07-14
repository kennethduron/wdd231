const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('#main-nav');
const directory = document.querySelector('#directory');
const gridViewButton = document.querySelector('#grid-view');
const listViewButton = document.querySelector('#list-view');
const currentYear = document.querySelector('#currentyear');
const lastModified = document.querySelector('#lastModified');
let currentView = 'grid';

function toggleMenu() {
    if (!menuToggle || !mainNav) return;
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    mainNav.classList.toggle('is-open');
}

function setViewMode(view) {
    if (!directory || !gridViewButton || !listViewButton) return;

    currentView = view;
    const isGrid = view === 'grid';

    directory.classList.toggle('directory-grid', isGrid);
    directory.classList.toggle('directory-list', !isGrid);

    gridViewButton.classList.toggle('active', isGrid);
    listViewButton.classList.toggle('active', !isGrid);
    gridViewButton.setAttribute('aria-pressed', String(isGrid));
    listViewButton.setAttribute('aria-pressed', String(!isGrid));
}

function renderMembers(members) {
    if (!directory) return;
    directory.innerHTML = '';

    members.forEach(member => {
        const card = document.createElement('article');
        card.className = 'member-card';

        const link = document.createElement('a');
        link.href = member.website;
        link.target = '_blank';
        link.rel = 'noopener';
        link.textContent = member.name;
        link.className = 'member-name';

        const details = document.createElement('div');
        details.className = 'member-details';

        const address = document.createElement('p');
        address.textContent = member.address;
        address.className = 'member-address';

        const phone = document.createElement('p');
        phone.textContent = member.phone;
        phone.className = 'member-phone';

        const website = document.createElement('a');
        website.href = member.website;
        website.target = '_blank';
        website.rel = 'noopener';
        website.textContent = 'Visit Website';
        website.className = 'member-website';
        const membership = document.createElement('p');
        membership.textContent = `Membership: ${member.membership === 3 ? 'Gold' : member.membership === 2 ? 'Silver' : 'Member'}`;
        membership.className = `member-level level-${member.membership}`;

        details.append(address, phone, website, membership);

        if (currentView === 'grid') {
            const figure = document.createElement('figure');
            figure.className = 'member-figure';
            const image = document.createElement('img');
            image.src = `images/${member.image}`;
            image.alt = `${member.name} logo`;
            image.loading = 'lazy';
            figure.appendChild(image);
            card.append(figure, link, details);
        } else {
            card.append(link, details);
        }

        directory.appendChild(card);
    });
}

function showError() {
    if (!directory) return;
    directory.innerHTML = '<p class="error-copy">Member directory is currently unavailable. Please try again later.</p>';
}

async function getMembers() {
    try {
        const response = await fetch('data/members.json');
        if (!response.ok) throw new Error('Unable to load member data');
        const data = await response.json();
        renderMembers(data.members);
    } catch (error) {
        console.error(error);
        showError();
    }
}

function initFooter() {
    if (currentYear) currentYear.textContent = new Date().getFullYear();
    if (lastModified) lastModified.textContent = document.lastModified;
}

menuToggle?.addEventListener('click', toggleMenu);
gridViewButton?.addEventListener('click', () => setViewMode('grid'));
listViewButton?.addEventListener('click', () => setViewMode('list'));

setViewMode('grid');
initFooter();
getMembers();
