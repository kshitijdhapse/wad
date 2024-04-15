// mkdir student-management
// cd student-management
// npm init -y
// npm install express mongoose
// npm install ejs
// create folder named views and then student.ejs file

const express = require('express');
const path = require('path'); // Import the path module
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/student')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));


// Create schema for studentmarks collection
const studentSchema = new mongoose.Schema({
  Name: String,
  Roll_No: Number,
  WAD_Marks: Number,
  CC_Marks: Number,
  DSBDA_Marks: Number,
  CNS_Marks: Number,
  AI_Marks: Number
});

const Student = mongoose.model('studentmarks', studentSchema);

// Routes
// Assuming this is in your index.js file


// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// For fetching and displaying data in the browser
app.get('/students', async (req, res) => {
    try {
      const students = await Student.find();
      res.render('students', { students }); // Assuming you're using a templating engine like EJS
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
    }
  });
  ` `

// For inserting array of documents
app.post('/insert', async (req, res) => {
    try {
      const students = req.body;
      const insertedStudents = await Student.insertMany(students);
      res.json(insertedStudents);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
    }
  });
  
  // For displaying total count of documents
  app.get('/count', async (req, res) => {
    try {
      const count = await Student.countDocuments();
      res.json({ count });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
    }
  });
  
  // For listing names of students who got more than 20 marks in DSBDA Subject
  app.get('/highdsbda', async (req, res) => {
    try {
      const students = await Student.find({ DSBDA_Marks: { $gt: 20 } }, { Name: 1, _id: 0 });
      res.json(students);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
    }
  });
  
  // For updating marks of specified students by 10
app.put('/updateMarks', async (req, res) => {
  try {
    const filter = { /* Specify filter criteria to identify the students to update */ };
    const update = { $inc: { 
      WAD_Marks: 10,
      CC_Marks: 10,
      DSBDA_Marks: 10,
      CNS_Marks: 10,
      AI_Marks: 10
    }};
    const options = { new: true };
    const updatedStudents = await Student.updateMany(filter, update, options);
    res.json(updatedStudents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// For listing names who got more than 25 marks in all subjects
app.get('/highMarks', async (req, res) => {
  try {
    const students = await Student.find({
      WAD_Marks: { $gt: 25 },
      CC_Marks: { $gt: 25 },
      DSBDA_Marks: { $gt: 25 },
      CNS_Marks: { $gt: 25 },
      AI_Marks: { $gt: 25 }
    }, { Name: 1, _id: 0 });
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});
// For listing names who got less than 40 in both Maths and Science
app.get('/lowMarks', async (req, res) => {
  try {
    const students = await Student.find({
      WAD_Marks: { $lt: 90 },
      CC_Marks: { $lt: 90 }
    }, { Name: 1, _id: 0 });
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});
// For removing specified student document from the collection
app.delete('/removeStudent/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const removedStudent = await Student.findByIdAndRemove(id);
    res.json(removedStudent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

  // Additional routes and functions for the other tasks would go here
  
