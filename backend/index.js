const app = require("./app");
const { PORT } = require("./config/Environments");

app.listen(PORT, () => console.log(`Application listening on port: ${PORT}`));