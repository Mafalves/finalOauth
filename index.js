// Imports
const express = require('express');
const app = express();
const axios = require('axios')
const port = process.env.PORT || 2400;

// Used for the purposes of UI interaction
app.set('view engine', 'ejs');

//  Settings
const id = '3cbfbd65432433b0aa83'
const secret = 'df4c8b5d32a5b819daa9bba105aa2dabd5fea606'
let access_token = "";


// Basice HTTP requests
app.get('/', (req, res) => {
    res.render('pages/index', { client_id: id });
});

app.get('/github/callback', (req, res) => {
    let token = req.query.code

    axios({
        method: 'post',
        url: `https://github.com/login/oauth/access_token?client_id=${id}&client_secret=${secret}&code=${token}`,
        headers: {
            accept: 'application/json'
        }
    }).then((response) => {
        access_token = response.data.access_token
        res.redirect('/info');
    })
})

app.get('/info', (req, res) => {
    axios({
        method: 'get',
        url: `https://api.github.com/user`,
        headers: {
            Authorization: 'token ' + access_token
        }
    }).then((response) => {
        res.render('pages/info', { userData: response.data });
    })
});


// Listening
app.listen(port, () => console.log(`Listening on port ${port}`));