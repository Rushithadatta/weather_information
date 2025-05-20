import express from 'express';  
import axios from 'axios';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
const app = express();
const PORT = 3000;
const API_URL = 'https://api.weatherstack.com';
const API_KEY = "8f3d3ea7b1df14c638a78989a5c25523";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('index', { weatherData: null, error: null });
});
app.post('/weather', async (req, res) => {
  const city = req.body.city;
  try {
    const response = await axios.get(`${API_URL}/current`, {
      params: {
        access_key: API_KEY,
        query: city
      }
    });
    const weatherData = response.data;
    res.render('index', { weatherData, error: null });
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.render('index', { weatherData: null, error: 'Failed to fetch weather data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});