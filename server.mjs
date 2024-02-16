import express from 'express';
import exphbs from 'express-handlebars';
import  path  from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

const hbs = exphbs.create({});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'dist')));

app.use(express.static('./'));
app.use('/pages', express.static('src/pages'));
app.use('/static', express.static('static'));

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});