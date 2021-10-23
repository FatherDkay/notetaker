const express = require('express');
const app = express();
const { notes } = require('./data/notes');

//Start filter 
function filterByQuery(query, notesArray) {
    let filteredResults = notesArray;
    if (query.id) {
      filteredResults = filteredResults.filter(note => note.id === query.id);
    };
    if (query.title) {
      filteredResults = filteredResults.filter(note => note.title === query.title);
    };
    if (query.text) {
      filteredResults = filteredResults.filter(note => note.text === query.text);
    };
    return filteredResults;
  };
//End filter

app.get('/api/notes', (req, res) => {
    let results = notes;
    if (req.query) {
      results = filterByQuery(req.query, results);
    };
    res.json(results);
  });

app.listen(3001, () => {
    console.log('API server now on port 3001');
});
