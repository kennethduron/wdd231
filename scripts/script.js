const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('#main-nav');
const courseList = document.querySelector('#course-list');
const courseCount = document.querySelector('#course-count');
const creditTotal = document.querySelector('#credit-total');
const filterButtons = document.querySelectorAll('.filter-button');
const currentYear = document.querySelector('#currentyear');
const lastModified = document.querySelector('#lastModified');

const courses = [
    {
        code: 'WDD 231',
        title: 'Web Frontend Development I',
        subject: 'WDD',
        credits: 3,
        completed: true,
        description: 'Introduction to semantic HTML, responsive layout, and accessible webpages.'
    },
    {
        code: 'WDD 130',
        title: 'Web Technologies',
        subject: 'WDD',
        credits: 3,
        completed: false,
        description: 'Foundations of CSS, layout systems, and browser-based design tools.'
    },
    {
        code: 'CSE 121',
        title: 'Introduction to Programming',
        subject: 'CSE',
        credits: 3,
        completed: true,
        description: 'Algorithms, problem solving, and introductory programming concepts.'
    },
    {
        code: 'CSE 231',
        title: 'JavaScript for Web Development',
        subject: 'CSE',
        credits: 3,
        completed: false,
        description: 'JavaScript fundamentals and DOM scripting for interactive webpages.'
    },
    {
        code: 'CSE 260',
        title: 'Software Design Principles',
        subject: 'CSE',
        credits: 3,
        completed: true,
        description: 'Design patterns, testing, and code quality for sustainable applications.'
    }
];

function createCourseItem(course) {
    const courseCard = document.createElement('div');
    courseCard.className = 'course-item';
    if (course.completed) {
        courseCard.classList.add('completed');
    }

    courseCard.innerHTML = `
    <h3>${course.code}: ${course.title}</h3>
    <div class="course-meta">
      <span>${course.subject}</span>
      <span>${course.credits} credits</span>
      <span class="status-badge">${course.completed ? 'Completed' : 'In progress'}</span>
    </div>
    <p>${course.description}</p>
  `;

    return courseCard;
}

function updateCourseList(filter = 'all') {
    if (!courseList || !courseCount || !creditTotal) return;

    const filteredCourses = filter === 'all'
        ? courses
        : courses.filter(course => course.subject === filter);

    courseList.innerHTML = '';
    filteredCourses.forEach(course => courseList.appendChild(createCourseItem(course)));

    const totalCredits = filteredCourses.reduce((sum, course) => sum + course.credits, 0);
    courseCount.textContent = filteredCourses.length;
    creditTotal.textContent = totalCredits;
}

function updateFilterButtons(activeFilter) {
    filterButtons.forEach(button => {
        const filter = button.dataset.filter;
        button.classList.toggle('active', filter === activeFilter);
    });
}

function initNavigationToggle() {
    if (!menuToggle || !mainNav) return;

    menuToggle.addEventListener('click', () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', String(!isExpanded));
        mainNav.classList.toggle('is-open');
    });
}

function initFooter() {
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    if (lastModified) {
        lastModified.textContent = `Last modified: ${document.lastModified}`;
    }
}

function initFilters() {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            updateFilterButtons(filter);
            updateCourseList(filter);
        });
    });
}

initNavigationToggle();
initFooter();
initFilters();
updateCourseList();
