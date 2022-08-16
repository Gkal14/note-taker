//dependencies
const express = require("express");
const fs = require("fs");
const path = require("path");
const util= require("util");

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("./public"));

const dbNotes = JSON.parse(
fs.readFileSync(path.join(__dirname, "./db/db.json"), (err, data) => {
    if (err) throw err;
}));


// html routes
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes",  function(req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "./db/db.json"));
});

app.get("/assets/css/styles.css", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/assets/css/styles.css"));
    });
    
app.get("/assets/js/index.js", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/assets/js/index.js"));
    });

// GET request
app.get("/api/notes", function(req, res) {
      readFileAsync("./db/db.json", "utf8").then(function(data) {
          notes = [].concat(JSON.parse(data))
          res.json(notes);
        })
    }); 
  
// POST request
app.post("/api/notes", function(req, res) {
  const note = req.body;
  readFileAsync("./db/db.json", "utf8").then(function(data) {
    const notes = [].concat(JSON.parse(data));
    note.id = notes.length + 1
    notes.push(note);
    return notes
  }).then(function(notes) {
    writeFileAsync("./db/db.json", JSON.stringify(notes))
    res.json(note);
  })
});

// DELETE
app.delete("/api/notes/:id", function(req, res) {
const idToDelete = parseInt(req.params.id);
readFileAsync("./db/db.json", "utf8").then(function(data) {
  const notes = [].concat(JSON.parse(data));
  const newNotesData = []
  for (let i = 0; i<notes.length; i++) {
    if(idToDelete !== notes[i].id) {
      newNotesData.push(notes[i])
    }
  }
  return newNotesData
}).then(function(notes) {
  writeFileAsync("./db/db.json", JSON.stringify(notes))
  res.send('saved succesfully');
})
})

//listen 
app.listen(PORT, () => console.log("Server listening on port " + PORT));