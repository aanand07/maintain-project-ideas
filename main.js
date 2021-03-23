(async () => {
  let homeHtml = '';
  let loginHtml = '';
  let addChallengeHtml = '';
  const pageRefreshPath = sessionStorage.getItem('pathName');
  const rootDiv = document.getElementById('root');
  let routes;

  const getHackathons = () => JSON.parse(sessionStorage.getItem('hackathons')) || []

  /**@function to only show the relevant tabs in header */
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
      if (el.id === 'login' && sessionStorage.getItem('empId')) el.classList.add('d-none')
    })
  }
  toggleNav();

  const handleUpvote = ({ target }) => {
    target.previousSibling.innerText++;
    const index = target.parentElement.cells[0].innerText;
    let hackathons = getHackathons();
    hackathons.find(el => el['No'] == index)['Upvotes']++;
    sessionStorage.setItem('hackathons', JSON.stringify(hackathons));
  }

  const prepareTbody = hackathon => {
    const tr = document.createElement('tr');
    for (let key in hackathon) {
      const td = document.createElement('td');
      td.appendChild(document.createTextNode(hackathon[key]))
      tr.appendChild(td);
    }
    const btn = document.createElement('button');
    btn.classList.add('btn', 'btn-secondary');
    btn.innerText = 'Click to upvote';
    btn.addEventListener('click', handleUpvote);
    tr.appendChild(btn);
    return tr;
  }

  const sortHackathons = key => {
    const hackathons = getHackathons();
    key === 'Upvotes' ? hackathons.sort((a, b) => b['Upvotes'] - a['Upvotes']) :
      hackathons.sort((a, b) => new Date(b['Time']) - new Date(a['Time']));
    getAllChallenges(hackathons);
  }

  const prepareThead = hackathon => {
    const tr = document.createElement('tr');
    for (let key in hackathon) {
      const td = document.createElement('th');
      td.appendChild(document.createTextNode(key));
      if (key === 'Time' || key === 'Upvotes') {
        // this svg has been copied from bootstrap, as didnt want to load whole fa library.🙊 
        td.innerHTML += `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-sort-up" viewBox="0 0 16 16">
                        <path d="M3.5 12.5a.5.5 0 0 1-1 0V3.707L1.354 4.854a.5.5 0 1 1-.708-.708l2-1.999.007-.007a.498.498 0 0 1 .7.006l2 2a.5.5 0 1 1-.707.708L3.5 3.707V12.5zm3.5-9a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zM7.5 6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zm0 3a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z"/>
                      </svg>`;
        td.addEventListener('click', () => { sortHackathons(key) });
      }
      tr.appendChild(td);
    }
    return tr;
  }

  const getAllChallenges = (hacks) => {
    const container = document.getElementById('allChallenges');
    container.replaceChildren();
    const fragment = new DocumentFragment();
    const table = document.createElement('table');
    let hackathons = hacks || getHackathons();
    table.classList.add('table');
    hackathons.forEach((el, index) => {
      !index && table.appendChild(prepareThead(el));
      table.appendChild(prepareTbody(el));
    })
    fragment.appendChild(table);
    container.appendChild(fragment);
  }

  const loadPage = async (page) => {
    const response = await fetch(page);
    const resHtml = await response.text();
    return resHtml;
  };

  /**@function to fetch html content of the 3 routes. */
  const loadAllPages = async () => {
    homeHtml = `<div id="allChallenges"></div>`;
    loginHtml = await loadPage('login.html');
    addChallengeHtml = await loadPage('add-challenge.html');
  };

  const main = async () => {
    await loadAllPages();
    routes = {
      '/home': homeHtml,
      '/login': loginHtml,
      '/add-challenge': addChallengeHtml,
    };
  };

  // Invoke the Main function
  !pageRefreshPath && main();
  getHackathons().length > 0 && getAllChallenges();

  const addChallengeInStorage = () => {
    document.getElementById('addChallengeBtn').addEventListener('click', () => {
      const title = document.querySelector('#title').value;
      const description = document.querySelector('#description').value;
      const tags = document.querySelector('#tags').value;
      const hackathons = getHackathons();
      hackathons.push({ No: hackathons.length + 1, Title: title, Description: description, Tags: tags, Time: new Date().toLocaleString(), Upvotes: 0 })
      sessionStorage.setItem('hackathons', JSON.stringify(hackathons))
    })
  }

  const handleLogin = () => {
    document.getElementById('loginBtn').addEventListener('click', () => {
      sessionStorage.setItem('empId', document.getElementById('employeeId').value)
      onNavClick('/add-challenge')
    })
  }

  const checkPageRefresh = async () => {
    if (pageRefreshPath) {
      sessionStorage.removeItem('pathName');
      await main();
    }
  }

  const initRoutes = (pathname) => {
    switch (pathname) {
      case '/add-challenge':
        addChallengeInStorage();
        break;
      case '/home':
        getAllChallenges();
        break;
      case '/login':
        handleLogin();
        break;
    }
  }

  window.onNavClick = async (pathname) => {
    window.history.pushState({}, pathname, `${location.href.split('/').slice(0, -1).join('/')}${pathname}`);
    await checkPageRefresh();
    if (pathname === '/add-challenge' && !sessionStorage.getItem('empId')) {
      alert('Please login to add a challenge');
      onNavClick('/login');
      return;
    }
    rootDiv.innerHTML = routes[pathname];
    initRoutes(pathname);
    toggleNav();
  };

  pageRefreshPath && onNavClick(pageRefreshPath);

  // To handle back and forward buttons.
  window.addEventListener('popstate', () => {
    rootDiv.innerHTML = routes[window.location.pathname] || '';
  })

})()