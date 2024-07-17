const express = require('express');
const app = express();
const PORT = 3000;

const cors = require('cors');

app.use(cors());

app.get("/", (req, res) => {
    res.send("밥이 컽 !")
})

app.listen(PORT, (req, res) => {
    console.log("서버 대기 상태")
});