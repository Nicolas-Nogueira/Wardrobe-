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
    
    if(user === undefined) { // if username wasn't found in the credentials object
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


app.listen(3000, function(err){
    if(err) console.log(err);
    else console.log('Server listening on port 3000');
})