/* For the login page I did use some help from a tutorial for the best way of handleing login/registraion switching */

class App{
    constructor(){
        this.wrapper = document.querySelector('.login-page-wrapper');
        this.loginLink = document.querySelector('.login-link');
        this.registerLink = document.querySelector('.register-link');

        this.addActiveTag();
    }

    /* listens for a button click and then adds/removes the class active to the wrapper */
    addActiveTag(){
        this.registerLink.addEventListener('click', () => {
            this.wrapper.classList.add('active');
        });

        this.loginLink.addEventListener('click', () => {
            this.wrapper.classList.remove('active');
        });
    }
}

export default App;