const express = require('express');
const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
    res.send("내가 보임?")
})

app.listen(PORT, (req, res) => {
    console.log("서버 대기 상태")
});