describe('testing the functionality of methods from main.js attached to window', () => {

  it('onNavClick should call history.pushstate', () => {
    spyOn(window.history, 'pushState');
    window.onNavClick('');
    expect(window.history.pushState).toHaveBeenCalled();
  })

})