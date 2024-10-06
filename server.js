const express = require('express');
const app = express();

const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser')
const path = require('path')

const port = 4000;

const {expressjwt: expressJwt} = require('express-jwt');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended:true }));
app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin','http://localhost:3000');
    res.setHeader('Access-Control-Allow-Headers','Content-type,Aythorization');
    next();
});


const secretkey = 'My super secret key';
const jwtTokenAlgo = expressJwt({
    secret: secretkey,
    algorithms: ['HS256']
});

let users = [
    {
        id: 1,
        username: 'vamshidhar',
        password: 'Vamshi@123'
    },
    {
        id: 2,
        username: 'vamshi',
        password: 'Harshith@123'
    }
]
app.post('/api/login',(req,res) => {
    const  { username , password }= req.body;

    for(let user of users) {
        if(username == user.username && password == user.password) {
            let token = jwt.sign({id : user.id , username : user.username},secretkey,{expiresIn :'3m'}); //Token Expires in 3 minutes
            res.json({
                success: true,
                err: null,
                token: token
            });
            break;
        }
        else {
            res.status(401).json({
                success: false,
                token: null,
                err: 'Invalid Credentials!!! username or password is incorrect !!!'

            });
        }
    }
})

app.get('/api/dashboard', jwtTokenAlgo , (req,res) => {
    res.json({
        success: true,
        myContent:'Protected Content Only Logged in People can See'
    });
});


// new route settings
app.get('/api/settings', jwtTokenAlgo , (req,res) => {
    res.json({
        success: true,
        myContent:'This is Settings Page'
    });
});

app.get('/',(req,res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
})

app.use(function(err, req, res, next) {
    if(err.name ==='UnauthorizedError') {
        res.status(401).json({
            success: false,
            officialError: err,
            err: 'Username or Password is incorrect '
        });
    }
    else {
        next(err);
    }
});

app.listen(port, () =>{
    console.log(`Serving on port ${port}`)
})