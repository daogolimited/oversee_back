// index.js
const express = require('express'); // express 임포트
const app = express(); // app생성
const mongoose = require('mongoose');
const cors = require('cors')
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const port = 8001;
app.use(cors({
origin: true,
credentials: true
}));
require('dotenv').config()

//const passport = require('passport');
//const passportConfig = require('./passport');

const { upload } = require('./config/multerConfig');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//passportConfig(passport);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(passport.initialize());
//app.use(passport.session());

const path = require('path');
app.set('/routes', __dirname + '/routes');
app.use('/config', express.static(__dirname + '/config'));
//app.use('/image', express.static('./upload'));
app.use('/image', express.static(__dirname + '/image'));

app.use('/api',require('./routes/router'));
// CONNECT TO MONGODB SERVER
const db = mongoose.connection;
db.on('error', console.error);
db.once('open', function () {
    // CONNECTED TO MONGODB SERVER
    console.log("Connected to mongod server");
});
app.get('/', function (req, res) {
    res.send('hello world!!');
});
// app.post('/api/addproduct', upload.fields([{ name: 'main_img' }, { name: 'sub_img1' }, { name: 'sub_img2' }, { name: 'sub_img3' }, { name: 'sub_img4' }, { name: 'sub_img5' }]), (req, res, next) => {
//     try{
//         console.log(req.files)
//         response(req, res, -200, "서버 에러 발생", [])
//     }catch(e){
//         console.log(err)
//         response(req, res, -200, "서버 에러 발생", [])
//     }
// })
mongoose.connect('mongodb+srv://oversee:ekdhrh1101!@cluster0.fzsyusf.mongodb.net/?retryWrites=true&w=majority', { useUnifiedTopology: true, useNewUrlParser: true });
mongoose.Promise = global.Promise;

// 몽구스 연결
app.listen(port, () => console.log(`${port}포트입니다.`));
