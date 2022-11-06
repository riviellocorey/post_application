const asyncHandler = require("express-async-handler");
const axios = require("axios");

module.exports = {
    getPosts: asyncHandler(async (req, res) => {
        const posts = await axios.get("https://jsonplaceholder.typicode.com/posts");
        const results = posts.data;
        res.status(200).json({ status: "succeeded", data: results});
    })
};

