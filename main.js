const rootDiv = document.getElementById('root');
let login = '';
let addChallenge = '';
const pageRefreshPath = sessionStorage.getItem('pathName');
let routes;
let hackathons = JSON.parse(sessionStorage.getItem('hackathons')) || [];

const toggleNav = () => {
  let currentPage;
  switch (location.pathname) {
    case '/add-challenge':
      currentPage = 'addChallenge';
      break;
    case '/login':
      currentPage = 'login';
      break;
    default:
      currentPage = 'home'
  }
  Array.from(document.getElementById('nav').children).forEach(el => {
    if (el.id === currentPage) el.classList.add('d-none')
    else el.classList.remove('d-none')
    if(el.id === 'login' && sessionStorage.getItem('empId')) el.classList.add('d-none')
  })
}
toggleNav();

const getAllChallenges = () => {
  const container = document.getElementById('allChallenges');
  const fragment = new DocumentFragment();
  const table = document.createElement('table');
  hackathons.forEach((el, index) => {
    if (index === 0) {
      const tr = document.createElement('tr');
      for (let key in el) {
        const td = document.createElement('th');
        td.appendChild(document.createTextNode(key))
        tr.appendChild(td);
      }
      table.appendChild(tr)
    }
    const tr = document.createElement('tr');
    for (let key in el) {
      const td = document.createElement('td');
      td.appendChild(document.createTextNode(el[key]))
      tr.appendChild(td);
    }
    table.appendChild(tr)
  })
  fragment.appendChild(table);
  container.appendChild(fragment)
}

hackathons.length > 0 && getAllChallenges();

const loadPage = async (page) => {
  const response = await fetch(page);
  const resHtml = await response.text();
  return resHtml;
};

/**
 * The Async function loads all HTML to the variables 'home', 'about' & 'contact'
 */
const loadAllPages = async () => {
  home = `<div id="allChallenges"></div>`;
  login = await loadPage('login.html');
  addChallenge = await loadPage('add-challenge.html');
};

const main = async () => {
  await loadAllPages();
  routes = {
    '/home': home,
    '/login': login,
    '/add-challenge': addChallenge,
  };
};

// Invoke the Main function
!pageRefreshPath && main();

const loadScript = (pathname) => {
  let script = document.createElement('script');
  script.src = `${pathname.slice(1)}.js`;
  document.getElementsByTagName('body')[0].appendChild(script);
}

const addChallengeInStorage = () => {
  document.getElementById('addChallengeBtn').addEventListener('click', () => {
    const title = document.querySelector('#title').value;
    const description = document.querySelector('#description').value;
    const tags = document.querySelector('#tags').value;
    hackathons.push({ title, description, tags })
    sessionStorage.setItem('hackathons', JSON.stringify(hackathons))
  })
}

const handleLogin = () => {
  document.getElementById('loginBtn').addEventListener('click', () => {
    sessionStorage.setItem('empId', document.getElementById('employeeId').value)
    onNavClick('/add-challenge')
  })
}

const checkLogin = (pathname) => {
  if(pathname === '/add-challenge' && !sessionStorage.getItem('empId')){
    onNavClick('/login');
    alert('Please login to add a challenge');
  }
}

const onNavClick = async (pathname) => {
  window.history.pushState({}, pathname, `${location.href.split('/').slice(0, -1).join('/')}${pathname}`);
  if (pageRefreshPath) {
    sessionStorage.removeItem('pathName');
    await main();
  }
  checkLogin(pathname);
  rootDiv.innerHTML = routes[pathname];
  pathname === '/add-challenge' && addChallengeInStorage();
  pathname === '/home' && getAllChallenges();
  pathname === '/login' && handleLogin();
  toggleNav();
};

if (sessionStorage.getItem('pathName')) {
  onNavClick(sessionStorage.getItem('pathName'))
}

window.addEventListener('popstate', () => {
  rootDiv.innerHTML = routes[window.location.pathname] || '';
})