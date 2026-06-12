import express from 'express';
import fs from 'fs';
import credentials from './data/credentials.json' with { type: 'json' };
import clothes from './data/clothes.json' with { type: 'json' };
const app = express();

app.use(express.json());
app.use(express.static('public', { index: 'login.html' })); // { index: 'login.html' } tells the server to respond to "GET /" with login.html 

app.get('/clothes', function(req, res){
    res.json(clothes);
});

// handle user login by POST
app.post('/login', function(req, res){
    const email = req.body.email;
    const user = credentials[email];
    
    if(user === undefined) { // if Email wasn't found in the credentials object
        res.json({ success: false, message: 'Email does not exist.' }); // send a response that the authentication was unsuccessful
        return;
    }

    if(user.password === req.body.password){ // if password is the correct password
        res.json({ success: true, message: 'User authentication successful.'}); // send a response that the authentication was successful
    }
    else {                                   // otherwise
        res.json({ success: false, message: 'Incorrect password.' }); // send a response that the authentication was unsuccessful
    }
});

// handle user registration by POST
app.post('/register', function(req, res){
    const email = req.body.email;
    const existingUser = credentials[email];

    if(existingUser !== undefined){ // if the Email already exists in the database 
        res.json({ success: false, message: 'Email is already taken.' }); // send a failure message stating that the username has already been taken
        return; // exit the handler
    }
     // add new user to the credentials object
     credentials[email] = { 
        password: req.body.password,
        username: req.body.username,
    };

    // update the credentials.json file with the new credentials object containing the new user
    fs.writeFile('./data/credentials.json', JSON.stringify(credentials, null, 4), 'utf-8', function(err){
        if(err) console.log(err);
        else console.log('Credentials saved to data/credentials.json');
    })

    // send a success message
    res.json({ success: true, message: "Registration successful."})
})




app.listen(3000, function(err){
    if(err) console.log(err);
    else console.log('Server listening on port 3000');
})