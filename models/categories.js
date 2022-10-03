const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');
//create Categorys Schema & model
const CategorySchema = new Schema({
    pk: {
        type: Number,
        default: 0
    },
    name: {
        type: String,
        required: [true]
    },
    en_name: {
        type: String,
        required: [true]
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
CategorySchema.plugin(autoIncrement.plugin, {
    model: 'category',
    field: 'pk',
    startAt: 1,
    incrementBy: 1
});
const Category = mongoose.model('category', CategorySchema);

module.exports = Category;
