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
        description: 'Working with semantic HTML, responsive layout, and accessible design patterns.'
    },
    {
        code: 'WDD 130',
        title: 'Web Technologies',
        subject: 'WDD',
        credits: 3,
        completed: false,
        description: 'Reviewing HTML and CSS foundations while building practical page layouts.'
    },
    {
        code: 'CSE 121',
        title: 'Introduction to Programming',
        subject: 'CSE',
        credits: 3,
        completed: true,
        description: 'Writing program logic and solving problems with code in a structured way.'
    },
    {
        code: 'CSE 231',
        title: 'JavaScript for Web Development',
        subject: 'CSE',
        credits: 3,
        completed: false,
        description: 'Using JavaScript and DOM scripting to make pages interactive and dynamic.'
    },
    {
        code: 'CSE 260',
        title: 'Software Design Principles',
        subject: 'CSE',
        credits: 3,
        completed: true,
        description: 'Applying software engineering habits, testing, and organized code design.'
    }
];

function createCourseItem(course) {
    const courseItem = document.createElement('li');
    courseItem.className = 'course-item';
    if (course.completed) {
        courseItem.classList.add('completed');
    }

    courseItem.innerHTML = `
    <h3>${course.code}: ${course.title}</h3>
    <div class="course-meta">
      <span>${course.subject}</span>
      <span>${course.credits} credits</span>
      <span class="status-badge">${course.completed ? 'Completed' : 'In progress'}</span>
    </div>
    <p>${course.description}</p>
  `;

    return courseItem;
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
