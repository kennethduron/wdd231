const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('#main-nav');
const courseList = document.querySelector('#course-list-items');
const courseCount = document.querySelector('#course-count');
const creditTotal = document.querySelector('#credit-total');
const filterButtons = document.querySelectorAll('.filter-button');
const pageYear = document.querySelector('#page-year');
const lastModified = document.querySelector('#last-modified');

const courses = [
  {
    code: 'WDD 231',
    title: 'Web Frontend Development I',
    subject: 'web',
    credits: 3,
    completed: true,
    description: 'Introduction to semantic HTML, responsive layout, and accessible webpages.'
  },
  {
    code: 'IST 220',
    title: 'Interaction Design',
    subject: 'design',
    credits: 3,
    completed: false,
    description: 'Design principles, visual hierarchy, and interface usability for digital products.'
  },
  {
    code: 'ENG 150',
    title: 'English Composition',
    subject: 'writing',
    credits: 3,
    completed: true,
    description: 'Writing practice for academic and professional communication with clear structure.'
  },
  {
    code: 'WDD 130',
    title: 'Web Technologies',
    subject: 'web',
    credits: 3,
    completed: false,
    description: 'Foundations of CSS, layout systems, and browser-based design tools.'
  },
  {
    code: 'ART 101',
    title: 'Visual Communication',
    subject: 'design',
    credits: 2,
    completed: true,
    description: 'Core visual concepts such as color, typography, and composition for digital art.'
  }
];

function createCourseItem(course) {
  const listItem = document.createElement('li');
  listItem.className = 'course-item';
  listItem.innerHTML = `
    <h3>${course.code}: ${course.title}</h3>
    <div class="course-meta">
      <span>${course.subject.toUpperCase()}</span>
      <span>${course.credits} credits</span>
      <span class="status-badge">${course.completed ? 'Completed' : 'In progress'}</span>
    </div>
    <p>${course.description}</p>
  `;
  return listItem;
}

function updateCourseList(subject = 'all') {
  if (!courseList || !courseCount || !creditTotal) return;

  const filteredCourses = subject === 'all'
    ? courses
    : courses.filter(course => course.subject === subject);

  courseList.innerHTML = '';
  filteredCourses.forEach(course => courseList.appendChild(createCourseItem(course)));

  const totalCredits = filteredCourses.reduce((sum, course) => sum + course.credits, 0);
  courseCount.textContent = filteredCourses.length;
  creditTotal.textContent = totalCredits;
}

function updateFilterButtons(activeSubject) {
  filterButtons.forEach(button => {
    const subject = button.dataset.subject;
    button.classList.toggle('active', subject === activeSubject);
  });
}

if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    mainNav.classList.toggle('is-open');
  });
}

if (filterButtons.length > 0) {
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const subject = button.dataset.subject;
      updateFilterButtons(subject);
      updateCourseList(subject);
    });
  });
}

if (pageYear) {
  pageYear.textContent = `© ${new Date().getFullYear()} Valleyview Chamber Project`;
}

if (lastModified) {
  lastModified.textContent = `Last modified: ${document.lastModified}`;
}

updateCourseList();
