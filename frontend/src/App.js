import './App.css';
import axios from 'axios';
import React from 'react';

function App() {
    const [responseId, setResponseId] = React.useState("");
    const [responseState, setResponseState] = React.useState([]);

    const loadScript = (src) => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        })
    }

    const createRazorpayOrder = (amount) => {
        let data = JSON.stringify({
            amount: amount * 100,
            currency: "INR"
        });
        let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: "http://localhost:5000/orders",
            headers: {
                "Content-Type": "application/json"
            },
            data: data
        }

        axios.request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data))
                handleRazorpayScreen(response.data.amount)
            })
            .catch((error) => {
                console.log("error at", error);
            });
    };

    const handleRazorpayScreen = async (amount) => {
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

        if (!res) {
            alert("Some error at Razorpay screen loading");
            return;
        }
        const options = {
            key: 'rzp_test_9F50QY6esZMpoY',
            amount: amount,
            currency: 'INR',
            name: "GreenApple Coders",
            description: "Payment to GreenApple Coders",
            image: "https://example.com/your_logo.png",
            handler: function (response) {
                setResponseId(response.razorpay_payment_id)
            },
            prefill: {
                name: "GreenApple Coders",
                email: "greenapplecoders@gmail.com",
            },
            theme: {
                color: "#3399cc"
            }
        }
        const paymentObject = new window.Razorpay(options)
        paymentObject.open();
    };

    const paymentFetch = (e) => {
        e.preventDefault();
        const paymentId = e.target.paymentId.value;
        axios.get(`http://localhost:5000/payment/${paymentId}`)
            .then((response) => {
                console.log(response.data);
                setResponseState(response.data);
            })
            .catch((error) => {
                console.log("error occurs", error);
            })
    }

    return (
        <div className="App">
            <button onClick={() => createRazorpayOrder(100)}>Payment of Rs.100</button>
            {responseId && <p>{responseId}</p>}
            <h1>This is payment verification form</h1>
            <form onSubmit={paymentFetch}>
                <input type="text" name="paymentId"/>
                <button type="submit">Fetch Payment</button>
            </form>
        </div>
    );
}

export default App;
