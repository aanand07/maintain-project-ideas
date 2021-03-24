# Hack Ideas

This application has been created in `vanilla javascript`, no external packages has been used, even SPA like routing has been handled in vanilla js.
`Session storage` has been used to persist the data on browser.
This app has three routes, `home, login and add-challenge`. Home is the default route and has all the added challenges.
To add challenge, user has to login first. Care has been taken to not let unauthenticated users add challenges.
Navs have been hidden and shown according to the current route and logged in state.

Realtime change in `upvotes` has been done. `Sorting` the challenges based on time and count of upvotes has been implemented.

Unit testing has been done using `Jasmine`, simply run spec.html file in the browser. Test case has been written to test only the methods added in window, because `main.js` has been implemented as an IIFE.

`No additional packages or framework is required` to run the application, simply spawn a server. If `http-server` is installed run `http-server -o home.html` in the root folder, and default home page will open in the browser.

