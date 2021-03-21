const rootDiv = document.getElementById('root');

//Declare the variables for home, about & contact html pages

// let login = '';
// let addChallenge = '';

/**
 *
 * @param {String} page - Represents the page information that needs to be retrieved
 * @returns {String} resHtml - The Page's HTML is returned from the async invocation
 */

const loadPage = async (page) => {
  const response = await fetch(page);
  const resHtml = await response.text();
  return resHtml;
};

/**
 * The Async function loads all HTML to the variables 'home', 'about' & 'contact'
 */
// const loadAllPages = async () => {
// //   home = await loadPage('home.html');
//   login = await loadPage('login.html');
//   addChallenge = await loadPage('add-challenge.html');
// };

const addChallenge = `
<form>
        <div class="form-group col-md-4">
            <label for="title">Title</label>
            <input type="text" id="title" class="form-control">
            <!-- <div class="form-group"> -->
            <label for="description">Description</label>
            <input type="text" id="description" class="form-control">
            <!-- </div> -->
            <!-- <div class="select"> -->
            <label for="tags">Tags</label>
            <select id="tags" name="tags" class="form-control">
                <option value="">Select a tag</option>
                <option value="feature">Feature</option>
                <option value="tech">Tech</option>
            </select>
            <!-- </div> -->
            <button type="submit" class="btn btn-success">Submit</button>
        </div>
    </form>
`

const login = `
<input type="text" placeholder="Enter your employee id"/>
`

const routes = {
        '/add-challenge': addChallenge,
        '/login': login,
      };

// /**
//  * The Main Function is an async function that first loads All Page HTML to the variables
//  * Once the variables are loaded with the contents, then they are assigned to the 'routes' variable
//  */
// const main = async () => {
//   await loadAllPages();
//   rootDiv.innerHTML = home;
//   routes = {
//     '/add-challenge': addChallenge,
//     '/login': login,
//   };
// };

// // Invoke the Main function
// main();

/**
 *
 * @param {String} pathname - Pass the 'pathname' passed from onClick function of the link (index.html)
 * The function is invoked when any link is clicked in the html.
 * The onClick event on the html invokes the onNavClick & passes the pathname as param
 */
const onNavClick = (pathname) => {
  window.history.pushState({}, pathname, `${location.href.split('/').slice(0,-1).join('/')}${pathname}`);
  rootDiv.innerHTML = routes[pathname];
};

/**
 * The Function is invoked when the window.history's state changes
 */
window.onpopstate = () => {
  rootDiv.innerHTML = routes[window.location.pathname];
};