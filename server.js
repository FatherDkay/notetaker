const fs =require('fs');
const path = require('path');
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
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

//Start findById
function findById(id, notesArray) {
    const result = notesArray.filter(note => note.id === id)[0];
    return result;
};
//End findById

//Start createNewNote
function createNewNote(body, notesArray) {
    const note = body;
    notesArray.push(note);
    fs.writeFileSync(path.join(__dirname, './data/notes.json'),
    JSON.stringify({ notes: notesArray }, null, 2)
    );
    return note;
};
//End createNewNote

//Start data validation
function validateNote(note) {
    if(!note.title || typeof note.title !== 'string') {
        return false;
    }
    if(!note.text || typeof note.text !== 'string') {
        return false;
    }
    return true;
};
//End data validation

//Start routes
app.get('/api/notes', (req, res) => {
    let results = notes;
    if (req.query) {
      results = filterByQuery(req.query, results);
    };
    res.json(results);
});

app.get('/api/notes/:id', (req,res) => {
    const result =findById(req.params.id, notes);
    if (result){
        res.json(result);
    } else {
        res.send(404);
    }
});

app.post('/api/notes', (req, res) =>{
    req.body.id = notes.length.toString();
    if(!validateNote(req.body)) {
        res.status(400).send('The note is not properly formatted.');
    } else {
    const note = createNewNote(req.body, notes);
    res.json(note);
    };
});
//End routes

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});
