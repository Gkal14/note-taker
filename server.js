//dependencies
const fs = require("fs");
const express = require("express");
const path = require("path");


const app = express();
const PORT = process.env.PORT || 3001;

//serve images, CSS files, and JavaScript files in a directory named public
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./db/db.json"));
});


app.post("/api/notes", function(req, res) {
    fs.readFile(path.join(__dirname, "./db/db.json"), "utf8", function(error, response) {
        if (error) {
            console.log(error);
        }
        const notes = JSON.parse(response);
        const noteRequest = req.body;
        const newNoteID = notes.length + 1;
        const newNote = {
            id: newNoteID,
            title: noteRequest.title,
            text: noteRequest.text
        };
        notes.push(newNote);
        res.json(newNote);
        fs.writeFile(path.join(__dirname, "./db/db.json"), JSON.stringify(notes, null, 2), function(err) {
            if (err) throw err;
        });
    });
});

app.delete("/api/notes/:id", function(req, res) {
    const deleteID = req.params.id;
    fs.readFile("./db/db.json", "utf8", function(error, response) {
        if (error) {
            console.log(error);
        }
        let notes = JSON.parse(response);
        if(deleteID <= notes.length) {
            res.json(notes.splice(deleteID-1,1));
            for (let i = 0; i < notes.length; i++) {
                notes[i].id = i+1;
            }
            fs.writeFile("./db/db.json", JSON.stringify(notes, null, 2), function(err) {
                if (err) throw err;
            });
        }else {
            res.json(false);
        }
    });
});

//listen 
app.listen(PORT, () => console.log("Server listening on port " + PORT));
  
  

