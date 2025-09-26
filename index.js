import express from 'express';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config(); // ✅ load .env variables

const app = express();
const PORT = process.env.PORT || 3000;
const API_URL = process.env.API_URL || 'http://api.weatherstack.com';
const API_KEY = process.env.API_KEY;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ middleware
app.use(express.urlencoded({ extended: true })); // replaces body-parser
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.get('/', (req, res) => {
  res.render('index', { weatherData: null, error: null });
});

app.post('/weather', async (req, res) => {
  const city = req.body.city;
  if (!city) {
    return res.render('index', { weatherData: null, error: 'Please enter a city' });
  }

  try {
    const response = await axios.get(`${API_URL}/current`, {
      params: {
        access_key: API_KEY,
        query: city
      }
    });

    const weatherData = response.data;

    if (weatherData.error) {
      // API-specific error handling
      return res.render('index', { weatherData: null, error: weatherData.error.info });
    }

    res.render('index', { weatherData, error: null });
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.render('index', { weatherData: null, error: 'Failed to fetch weather data' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
