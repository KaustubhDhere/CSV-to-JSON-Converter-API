import express from 'express';
import multer from 'multer';
import { connectDB } from './database';
import { parseCSV, saveUsersToDatabase } from './csvParser'; 


const app = express();
const upload = multer({ dest: 'uploads/' });

connectDB();

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }

    const users = await parseCSV(req.file.path);
    await saveUsersToDatabase(users);  

   
    const ageGroups = { '<20': 0, '20-40': 0, '40-60': 0, '>60': 0 };
    users.forEach((user: any) => {
      if (user.age < 20) {
        ageGroups['<20']++;
      } else if (user.age <= 40) {
        ageGroups['20-40']++;
      } else if (user.age <= 60) {
        ageGroups['40-60']++;
      } else {
        ageGroups['>60']++;
      }
    });

    const totalUsers = users.length;
    console.log('Age-Group | % Distribution');
    for (const [ageGroup, count] of Object.entries(ageGroups)) {
      const percentage = ((count / totalUsers) * 100).toFixed(2);
      console.log(`${ageGroup} | ${percentage}%`);
    }

    res.send('File uploaded and data processed');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error processing file');
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
