require("dotenv").config();
const express = require('express');
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 8000;
const weatherUrl = "http://api.weatherapi.com/v1";

app.get('/api/hello', async (req, res) => {
    try {
        const ip = process.env.NODE_ENV === “production” ? req.headers[“x-forwarded-for”] : req.ip
        const visitor = req.query.visitor_name;
        const name = visitor ? visitor : "username";

        // Log the IP and visitor name for debugging
        console.log(`Client IP: ${ip}, Visitor Name: ${name}`);

        // Example IP for testing purposes
        const testIp = '8.8.8.8'; // Google's public DNS server
        const response = await axios.get(`${weatherUrl}/current.json?key=${process.env.WEATHER_API_KEY}&q=${req.ip}`)

        const data = response.data;
        const result = {
            client_ip: ip, //The IP address of the requester
            location: data.location.name, // The city of the requester
            greeting: `Hello, ${name}! The temperature is ${data.current.temp_c} degrees Celsius in ${data.location.name}` 
        };

        res.status(200).json(result);
    } catch (error) {
        console.error('Error:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
            res.status(400).json({ status: false, error: error.response.data.error.message });
        } else {
            res.status(400).json({ status: false, error: error.message });
        }
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
