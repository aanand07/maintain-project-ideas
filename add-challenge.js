(function () {
    let prevPathname = location.pathname;
    if (location.pathname !== '/home.html') {
        sessionStorage.setItem('pathName', '/add-challenge')
        location.href = `${location.href.split('/').slice(0, -1).join('/')}/home.html`;
        debugger;
        console.log(prevPathname)
        // window.onNavClick(prevPathname);
    }

    // sessionStorage.setItem('hackathons', JSON.stringify([]))
    // document.getElementById('addChallengeBtn').addEventListener('click', () => {
    //     const title = document.querySelector('#title').value;
    //     const description = document.querySelector('#description').value;
    //     const tags = document.querySelector('#tags').value;
    //     let hackathons = JSON.parse(sessionStorage.getItem('hackathons'))
    //     hackathons.push({ title, description, tags })
    // })
})()