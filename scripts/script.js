const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('#main-nav');

const courses = [
    {
        subject: 'CSE',
        number: 110,
        title: 'Programming Building Blocks',
        credits: 2,
        completed: true
    },
    {
        subject: 'WDD',
        number: 130,
        title: 'Web Fundamentals',
        credits: 2,
        completed: true
    },
    {
        subject: 'CSE',
        number: 111,
        title: 'Programming with Functions',
        credits: 2,
        completed: true
    },
    {
        subject: 'CSE',
        number: 210,
        title: 'Programming with Classes',
        credits: 2,
        completed: false
    },
    {
        subject: 'WDD',
        number: 131,
        title: 'Dynamic Web Fundamentals',
        credits: 2,
        completed: false
    },
    {
        subject: 'WDD',
        number: 231,
        title: 'Web Frontend Development I',
        credits: 2,
        completed: false
    }
];

function renderCourses(filter = 'all') {
    const courseList = document.querySelector('#course-list');
    const courseCount = document.querySelector('#course-count');
    const creditTotal = document.querySelector('#credit-total');

    if (!courseList || !courseCount || !creditTotal) {
        console.error('Course elements are missing.');
        return;
    }

    const filtered =
        filter === 'all' ? courses : courses.filter((c) => c.subject === filter);

    courseList.innerHTML = '';

    filtered.forEach((course) => {
        const li = document.createElement('li');
        li.className = course.completed ? 'course-item completed' : 'course-item';
        li.innerHTML = `
            <h3>${course.subject} ${course.number}</h3>
            <p class="course-title">${course.title}</p>
            <p class="course-meta">${course.credits} credits</p>
            <span class="course-status">${course.completed ? 'Completed' : 'In Progress'}</span>
        `;
        courseList.appendChild(li);
    });

    courseCount.textContent = filtered.length;
    creditTotal.textContent = filtered.reduce((sum, c) => sum + c.credits, 0);
}

function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-button');
    filterButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            filterButtons.forEach((b) => {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
            const filter = btn.dataset.filter;
            renderCourses(filter);
        });
    });
}

function setupNavigation() {
    if (!menuToggle || !mainNav) return;
    menuToggle.addEventListener('click', () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', String(!isExpanded));
        mainNav.classList.toggle('is-open');
    });
}

function setupFooter() {
    const currentYear = document.querySelector('#currentyear');
    const lastModified = document.querySelector('#lastModified');
    if (currentYear) currentYear.textContent = new Date().getFullYear();
    if (lastModified) lastModified.textContent = `Last modified: ${document.lastModified}`;
}

document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    setupFooter();
    setupFilters();
    renderCourses();
});
