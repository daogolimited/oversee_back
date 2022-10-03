const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');
//create products Schema & model
const SaleSchema = new Schema({
    pk: {
        type: Number,
        default: 0
    },
    user_pk: {
        type: Number,
        required: [true]
    },//구매유저 pk
    product_pk: {
        type: Number,
        required: [true]
    },//상품 pk
    count: {
        type: Number,
        required: [true]
    },//수량
    price: {
        type: Number,
        required: [true]
    },//금액
    status: {
        type: Number,
        default: 1
    },//상태, 장바구니-1, 구매-2
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
SaleSchema.plugin(autoIncrement.plugin, {
    model: 'sale',
    field: 'pk',
    startAt: 1,
    incrementBy: 1
});
const Sale = mongoose.model('sale', SaleSchema);

module.exports = Sale;
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