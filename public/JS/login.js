class App {
    constructor(){

        this.wrapper = document.querySelector('.login-page-wrapper');
        this.loginLink = document.querySelector('.login-link');
        this.registerLink = document.querySelector('.register-link');


        this.emailInput = document.querySelector('#login-email')
        this.passwordInput = document.querySelector('#login-password')
        this.loginBtn = document.querySelector('#login-btn')
        this.login = this.login.bind(this);
        document.querySelector('#login-btn').addEventListener('click', this.login);

        this.emailReg = document.querySelector('#register-email')
        this.usernameReg = document.querySelector('#register-username')
        this.passwordReg = document.querySelector('#register-password')
        this.regBtn= document.querySelector('#register-btn') 
        this.reg = this.reg.bind(this);
        document.querySelector('#register-btn').addEventListener('click', this.reg);

        this.addActiveTag();
    }

    addActiveTag(){
        this.registerLink.addEventListener('click', () => {
            this.wrapper.classList.add('active');
        });
    
        this.loginLink.addEventListener('click', () => {
            this.wrapper.classList.remove('active');
        });
    }

    async login(){
        const credentials = {
            email: this.emailInput.value,
            password: this.passwordInput.value
        }
        const response = await fetch('/login', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials)
        });
        const auth = await response.json();
        if(auth.success){
            window.location.href = 'index.html';
        } else {
            alert(auth.message);
        }
    }

    async reg(){
        const credentials = {
            email: this.emailReg.value,
            username: this.usernameReg.value,
            password: this.passwordReg.value
        }

        const response = await fetch('/register', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials)
        });

        const auth = await response.json();
        if(auth.success){
            alert('Registration successful! Please login.');
        } else {
            alert(auth.message);
        }
        

    }

}

export default App;
