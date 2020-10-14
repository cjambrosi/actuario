const express = require('express');
const PORT = process.env.PORT || 8088;

let app = express();
app.use(express.static(`${__dirname}/`));

app.listen(PORT, () => {
  console.log(`>> Server started!\n>> Port: ${PORT}`);
});