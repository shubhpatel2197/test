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
app.use(CORS({ 
    origin: ["https://test2-seven-nu.vercel.app"],
             methods:["POST","GET"],
             credentials:true}
            )
       );
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
const current = {};

io.on('connection', socket => {
    
    socket.on("join room", roomID => {

        if (!current[roomID]) {
            current[roomID] = {};
        }

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
        current[roomID][socket.id] = { cam: false, mic: false };

        console.log(current)
        socket.emit("current",current[roomID]);
        socket.emit("all users", usersInThisRoom);
        socket.emit("your id",{userID:socket.id});
        
    });

    socket.on("sending signal", payload => {
        io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID,cam:payload.cam,mic:payload.mic });
    });

    socket.on("returning signal", payload => {
        io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id,cam:payload.cam,mic:payload.mic  });
    });

    socket.on("stream changed", payload => {
        current[socketToRoom[socket.id]][socket.id] = { cam: payload.cam, mic: payload.mic };
        users[socketToRoom[socket.id]].forEach(userID => {
            io.to(userID).emit("user stream changed", { cam: payload.cam, mic: payload.mic, userID: payload.userID });
        });
    });

    // socket.on('disconnect', () => {
    //     let room = users[roomID];
    //     if (room) {
    //         room = room.filter(id => id !== socket.id);
    //         users[roomID] = room;
    //     }
    // });

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

app.get('/',(req,res)=>{
    res.json("Hello");
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

server.listen(port, () => {
    console.log("Server is ON at " + port);
});

