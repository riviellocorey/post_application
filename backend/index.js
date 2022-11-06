const express = require("express");
const { PORT, NODE_ENV } = require("./config/Environments");
const cors = require("cors");
const app = express();

app.use(cors());

// @ Posts Route
app.use("/api/v1/posts", require("./routes/posts"));

app.use((err, req, res, next) => {
    if (NODE_ENV === "development") {
        res.status(err.status).json({ status: "failed", data: { err }});
    } else {
        if (err.status > 400 && err.status < 500) {
            res.status(err.status).json({ status: "failed", data: { message: "Bad request" }});
        } else {
            res.status(err.status).json({ status: "failed", data: { message: "Internal Server Error" }});
        }
    }
});

app.listen(PORT, () => console.log(`Application listening on port: ${PORT}`));