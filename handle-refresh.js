(function () {
    if (location.pathname !== '/home.html') {
        sessionStorage.setItem('pathName', location.pathname);
        location.href = `${location.href.split('/').slice(0, -1).join('/')}/home.html`;
    }
})()