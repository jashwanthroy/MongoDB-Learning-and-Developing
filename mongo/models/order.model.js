const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    price: {
        type: Number,
        required: true
    }
},{ timestamps: true })

orderSchema.index({ userId: 1})

module.exports = mongoose.model("Order",orderSchema)