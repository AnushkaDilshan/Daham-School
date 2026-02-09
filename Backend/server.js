require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors =require('cors');
const authRoutes = require('./routes/user');
const studentRoutes = require('./routes/student');
const prefectRoutes = require('./routes/prefectRoutes');
const competitionRoutes = require('./routes/competitionRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
 // Import the Competition model for competitions

const app = express();
app.use(cors());
app.use(express.json());
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/prefects', prefectRoutes);
app.use('/api', competitionRoutes);
app.use('/api/teachers', teacherRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
