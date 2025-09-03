require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const PDFDocument = require('pdfkit');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3001;

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

app.use(cors());
app.use(express.json());
app.use('/exports', express.static('exports'));

app.get('/', (req, res) => {
  res.send('AI Travel Planner Backend is running!');
});

/**
 * API to generate a travel itinerary.
 * POST /api/generate
 * Body: { city: string, budget: number, days: number, preferences: string }
 */
app.post('/api/generate', async (req, res) => {
  const { city, budget, days, preferences } = req.body;

  if (!city || !budget || !days) {
    return res
      .status(400)
      .json({ error: 'City, budget, and days are required.' });
  }

  const prompt = `
    Create a travel itinerary for the city: ${city}, with a budget of ${budget} USD, for ${days} days, with preferences for: ${preferences}.
    For each day, provide:
    - A list of places to visit (like museums, parks, restaurants) with a short description, estimated cost, and geographic coordinates (latitude and longitude).
    - Transportation methods between locations.
    - A hotel suggestion with its price and coordinates.
    
    Return the output in a valid JSON format. Do not include any text outside the JSON.
    The JSON structure should be:
    {
      "itinerary": [
        {
          "day": number,
          "activities": [
            { "place": "string", "type": "museum"|"restaurant"|"park"|"attraction", "description": "string", "cost": number, "lat": number, "lng": number }
          ],
          "transport": [
            { "from": "string", "to": "string", "mode": "walk"|"bus"|"train"|"taxi" }
          ],
          "hotel": { "name": "string", "price": number, "lat": number, "lng": number }
        }
      ],
      "summary": { "totalCost": number }
    }
  `;

  try {
    // Mock response for development to avoid API calls
    const mockResponse = {
      city: city,
      itinerary: [
        {
          day: 1,
          activities: [
            {
              place: 'Eiffel Tower',
              type: 'attraction',
              description: 'Iconic landmark of Paris.',
              cost: 25,
              lat: 48.8584,
              lng: 2.2945,
            },
            {
              place: 'Louvre Museum',
              type: 'museum',
              description: 'Home to the Mona Lisa.',
              cost: 17,
              lat: 48.8606,
              lng: 2.3376,
            },
          ],
          transport: [
            { from: 'Eiffel Tower', to: 'Louvre Museum', mode: 'taxi' },
          ],
          hotel: {
            name: 'Hotel Lutetia',
            price: 400,
            lat: 48.8517,
            lng: 2.3269,
          },
        },
        {
          day: 2,
          activities: [
            {
              place: 'Cathédrale Notre-Dame de Paris',
              type: 'attraction',
              description: 'Famous medieval Catholic cathedral.',
              cost: 0,
              lat: 48.853,
              lng: 2.3499,
            },
          ],
          transport: [],
          hotel: {
            name: 'Hotel Lutetia',
            price: 400,
            lat: 48.8517,
            lng: 2.3269,
          },
        },
      ],
      summary: { totalCost: 842 },
    };

    // Add a surprise activity if requested
    if (preferences.toLowerCase().includes('surprise')) {
      const surpriseActivity = {
        place: 'Shakespeare and Company',
        type: 'attraction',
        description:
          'A famous independent bookstore with a rich history, opposite Notre-Dame.',
        cost: 0,
        lat: 48.8525,
        lng: 2.3473,
      };
      const randomDayIndex = Math.floor(
        Math.random() * mockResponse.itinerary.length
      );
      mockResponse.itinerary[randomDayIndex].activities.push(surpriseActivity);
    }

    res.json(mockResponse);

    /*
    // Uncomment this section to use the actual OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Or 'gpt-4'
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const itineraryJson = JSON.parse(response.choices[0].message.content);
    res.json(itineraryJson);
    */
  } catch (error) {
    console.error('Error generating itinerary:', error);
    res.status(500).json({ error: 'Failed to generate itinerary.' });
  }
});

/**
 * API to export itinerary as PDF.
 * POST /api/export/pdf
 */
app.post('/api/export/pdf', (req, res) => {
  const { itinerary, city, summary } = req.body;

  if (!itinerary) {
    return res.status(400).json({ error: 'Itinerary data is required.' });
  }

  const doc = new PDFDocument({ margin: 50 });
  const fileName = `travel-guide-${city
    .toLowerCase()
    .replace(/\s/g, '-')}-${Date.now()}.pdf`;
  const filePath = `exports/${fileName}`;

  // Create exports directory if it doesn't exist
  if (!fs.existsSync('exports')) {
    fs.mkdirSync('exports');
  }

  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  // --- PDF Content ---
  doc
    .fontSize(24)
    .font('Helvetica-Bold')
    .text(`Your Travel Guide to ${city}`, { align: 'center' });
  doc.moveDown();

  doc
    .fontSize(16)
    .font('Helvetica-Bold')
    .text(`Total Estimated Cost: $${summary.totalCost}`);
  doc.moveDown(2);

  itinerary.forEach((day) => {
    doc.fontSize(18).font('Helvetica-Bold').text(`Day ${day.day}`);
    doc.moveDown();

    if (day.hotel) {
      doc.fontSize(14).font('Helvetica-Bold').text('Hotel:');
      doc.font('Helvetica').text(`${day.hotel.name} - $${day.hotel.price}`);
      doc.moveDown();
    }

    doc.fontSize(14).font('Helvetica-Bold').text('Activities:');
    day.activities.forEach((activity) => {
      doc.font('Helvetica-Bold').text(activity.place, { continued: true });
      doc.font('Helvetica').text(` (${activity.type}) - $${activity.cost}`);
      doc.fontSize(10).fillColor('gray').text(activity.description);
      doc.moveDown(0.5);
    });
    doc.fillColor('black');
    doc.moveDown();

    doc.fontSize(14).font('Helvetica-Bold').text('Transport:');
    day.transport.forEach((leg) => {
      doc.font('Helvetica').text(`${leg.from} → ${leg.to} (${leg.mode})`);
    });
    doc.addPage();
  });

  doc.end();

  stream.on('finish', () => {
    const url = `${req.protocol}://${req.get('host')}/${filePath}`;
    res.json({ url });
  });

  stream.on('error', (err) => {
    console.error('Error writing PDF:', err);
    res.status(500).json({ error: 'Failed to generate PDF.' });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
