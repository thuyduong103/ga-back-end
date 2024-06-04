import fs from 'node:fs/promises';

import bodyParser from 'body-parser';
import express from 'express';

const app = express();

const PORT = 8080;

app.use(express.static('images'));
app.use(bodyParser.json());

// CORS

const readJSON = async (filePath) => {
  try {
    const fileContent = await fs.readFile(filePath);
    const data = JSON.parse(fileContent);
    return data;
  } catch (error) {
    return null;
  }
};

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // allow all domains
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  next();
});

app.get('/:name/list', async (req, res) => {
  const name = req?.params?.name;
  const data = await readJSON(`./data/${name}.json`);
  if (data) res.status(200).json({ list: data });
  else res.status(404).json({ data: null, message: 'data not found!' });
});

app.get('/:name/flash-sale', async (req, res) => {
  const name = req?.params?.name;
  const data = await readJSON(`./data/${name}-flash-sale.json`);

  if (data) res.status(200).json({ data: data || null });
  else res.status(404).json({ data: null, message: 'data not found!' });
});

app.get('/:name/detail/:id', async (req, res) => {
  const name = req?.params?.name;
  const id = req?.params?.id;

  const data = await readJSON(`./data/${name}.json`);
  if (!data) res.status(404).json({ data: null, message: 'data not found!' });

  const foundItem = data?.find((i) => i?.id === id);
  if (foundItem) res.status(200).json({ detail: foundItem || null });
  else res.status(404).json({ data: null, message: 'data not found!' });
});

// app.get('/user-places', async (req, res) => {
//   const fileContent = await fs.readFile('./data/user-tho.json');

//   const places = JSON.parse(fileContent);

//   res.status(200).json({ places });
// });

// app.put('/user-places', async (req, res) => {
//   const places = req.body.places;

//   await fs.writeFile('./data/user-tho.json', JSON.stringify(places));

//   res.status(200).json({ message: 'User places updated!' });
// });

// 404
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }
  res.status(404).json({ message: '404 - Not Found' });
});

app.listen(PORT, (err) => {
  if (err) console.log(err);
  else console.log(`App is running in port ${PORT}...`);
});
