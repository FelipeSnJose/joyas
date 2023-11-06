require('dotenv')
const express = require('express')
const cors = require('cors')

const { jewelryId, allJewels, JewelryByFilters } = require('../utils/pg')

const PORT = process.env.PORT ?? 3002
const app = express()

app.use(cors())
app.use(express.json())

app.get('/joyas', async (req, res) => {
    try {
      const { limits, page, order_by } = req.query;
      const order = order_by ? order_by.toLowerCase().replace('_', '_') : 'nombre_asc';
      const result = await allJewels({ limits, page, order_by: order });
      res.status(result?.code ? 500 : 200).json(result);
    } catch (error) {
      res.status(500).json(error);
    }
  });

  app.get('/joyas/filtros', async (req, res) => {
    try {
      const result = await JewelryByFilters(req.query);
      res.status(result?.code ? 500 : 200).json(result);
    } catch (error) {
      res.status(500).json(error);
    }
  });

  app.get('/joyas/joya/:id', async (req, res) => {
    try {
      const result = await jewelryId(req.params.id);
      res.status(result?.code ? 500 : 200).json(result);
    } catch (error) {
      res.status(500).json(error);
    }
  });

app.all('*', (_, res) => res.status(404).json({ code: 404, message: 'Error 404 NOT FOUND' }))

app.listen(PORT, () => console.log(`Servidor ok http://localhost:${PORT}`))