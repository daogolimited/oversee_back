const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');
//create products Schema & model
const ProductSchema = new Schema({
    pk: {
        type: Number,
        default: 0
    },
    name: {
        type: String,
        required: [true]
    },
    price: {
        type: Number,
        required: [true]
    },//가격
    main_img:{
        type: String,
        required: [true],
        default:""
    },
    sub_img1:{
        type: String,
        default:""
    },
    sub_img2:{
        type: String,
        default:""
    },
    sub_img3:{
        type: String,
        default:""
    },
    sub_img4:{
        type: String,
        default:""
    },
    sub_img5:{
        type: String,
        default:""
    },
    category_pk:{
        type: Number,
        default:0
    },
    note:{
        type: String,
        default:""
    },
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
ProductSchema.plugin(autoIncrement.plugin, {
    model: 'product',
    field: 'pk',
    startAt: 1,
    incrementBy: 1
});
const Product = mongoose.model('product', ProductSchema);

module.exports = Product;
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