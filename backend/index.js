const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Razorpay = require('razorpay');

const app = express();
const port = 5000; // Port for backend

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello world');
});

app.post('/order', async (req, res) => {
    const razorpay = new Razorpay({
        key_id: 'rzp_test_9F50QY6esZMpoY',
        key_secret: 'VHz4Tm5VVh3uvZFTFAOj3f8O'
    })
    const options = {
        amount: req.body.amount,
        currency: req.body.currency,
        receipt: 'receipt#1',
        payment_capture: 1,
    }

    try {
        const response = await razorpay.orders.create(options)
        res.json({
            order_id: response.id,
            currency: response.currency,
            amount: response.amount
        }) 
    } catch (error) {
        res.status(500).send("Internal Server Error")
    }
})

app.get("/payment/:paymentId", async (req, res) => {
    const { paymentId } = req.params;
    const razorpay = new Razorpay({
        key_id: 'rzp_test_9F50QY6esZMpoY',
        key_secret: 'VHz4Tm5VVh3uvZFTFAOj3f8O'    
    })

    try {
        const payment = await razorpay.payments.fetch(paymentId);
        if (!payment) {
            return res.status(500).send("Error at razorpay loading");
        }
        res.json({
            status: payment.status,
            method: payment.method,
            amount: payment.amount,
            currency: payment.currency
        })
    } catch (error) {
        res.status(500).json("Failed to fetch")
    }
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
