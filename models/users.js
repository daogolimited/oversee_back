const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');
//create products Schema & model
const UserSchema = new Schema({
    pk: {
        type: Number,
        default: 0
    },
    id: {
        type: String,
        required: [true]
    },//아이디
    pw: {
        type: String,
        required: [true]
    },//비밀번호
    name: {
        type: String,
        required: [true]
    },//이름
    address: {
        type: String,
        required: [true]
    },//주소
    email: {
        type: String,
        required: [true]
    },//이메일
    nickname: {
        type: String,
        required: [true]
    },//닉네임
    phone: {
        type: String,
        required: [true],
        default:"00000000"
    },//폰번호
    level: {
        type: Number,
        required: [true],
        default:0
    },//유저레벨
    date: {
        type: Date,
        default: k_date = () => {
            let date = new Date();
            let year = date.getFullYear();
            let month = date.getMonth();
            let today = date.getDate();
            let hours = date.getHours();
            let minutes = date.getMinutes();
            let seconds = date.getSeconds();
            let milliseconds = date.getMilliseconds();
            return new Date(Date.UTC(year, month, today, hours, minutes, seconds, milliseconds));
        }
    }
});
autoIncrement.initialize(mongoose.connection);
UserSchema.plugin(autoIncrement.plugin, {
    model: 'user',
    field: 'pk',
    startAt: 1,
    incrementBy: 1
});
const User = mongoose.model('user', UserSchema);

module.exports = User;
/*
[JSON FORMAT]

{
"productNo":"0",
"category":"category01",
"name":"product name",
"detail":"product detail",
"stock":"50",
"price":"35000",
"deliveryFee":"2500"
"token":"0"
}

*/