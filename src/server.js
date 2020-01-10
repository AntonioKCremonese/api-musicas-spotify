const app = require('./app');

app.listen(process.env.PORT || 3000, console.log(`API rodando na porta : ${process.env.PORT || 3000}`));