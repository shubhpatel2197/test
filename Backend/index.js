require('./Db/controller');;
const cookieParser = require('cookie-parser');
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const CORS = require('cors');
const http = require("http");
const socket = require("socket.io");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const User = require('./Model/User/user');


dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socket(server);
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Routes
const grproute = require('./Routes/groups');
app.use(grproute);

const users = {};
const socketToRoom = {};

io.on('connection', socket => {
    socket.on("join room", roomID => {
        if (users[roomID]) {
            const length = users[roomID].length;
            if (length === 4) {
                socket.emit("room full");
                return;
            }
            console.log("1")
            console.log(socket.id)
            users[roomID].push(socket.id);
        } else {
            console.log("2")
            console.log(socket.id)
            users[roomID] = [socket.id];
        }
        socketToRoom[socket.id] = roomID;
        const usersInThisRoom = users[roomID].filter(id => id !== socket.id);

        socket.emit("all users", usersInThisRoom);
    });

    socket.on("sending signal", payload => {
        io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
    });

    socket.on("returning signal", payload => {
        io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
    });

    socket.on('disconnect', () => {
        const roomID = socketToRoom[socket.id];
        let room = users[roomID];
        if (room) {
            room = room.filter(id => id !== socket.id);
            users[roomID] = room;
        }
    });

});

server.listen(port, () => {
    console.log("Server is ON at " + port);
});

module.exports = server;
app.use(session({
    secret: String(process.env.SKEY),
    resave: false,
    store: MongoStore.create({
        mongoUrl: process.env.DBURL,
        ttl: 14 * 24 * 60 * 60 // = 14 days. Default
      }),
    saveUninitialized: false,
    cookie: {
        maxAge: 2 * 60 * 60 * 1000 // 2 hours in milliseconds
    }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(CORS({ origin: '*' }));

// Passport local strategy
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await User.findOne({ email:email });
        if (!user) {
            return done(null, false, { message: 'Incorrect email.' });
        }
        if (user.password !== password) {
            return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

// Serialize and deserialize user
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});
app.use((req,res,next)=>{
    if(mongoose.connection.readyState==3||mongoose.connection.readyState==0){
    fire();
    next();
    }
    else
    next();
})


// Login route
app.post('/login', passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/fail'
}));

app.get('/fail', (req, res) => {
    res.send({error:"Login failed"});
});

// Profile route
app.get('/profile', isAuthenticated, (req, res) => {
    res.send({username:req.user.username,email:req.user.email,avatar:req.user.avatar});
});

// Signup route
app.post('/signup', async (req, res) => {
    try {
        const { username,email, password } = req.body;
        const newUser = new User({ username,email, password });
        newUser.avatar = `https://ui-avatars.com/api/?name=${username}&background=0D8ABC&color=fff`
        await newUser.save();
        res.send('Signup successful. Please <a href="/login">login</a>.');
    } catch (error) {
        res.status(500).send('Signup failed');
    }
});

app.use(grproute);
// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/fail');
}

