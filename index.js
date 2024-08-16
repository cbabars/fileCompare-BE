// server.js
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

app.post('/compare', upload.fields([{ name: 'file1' }, { name: 'file2' }]), (req, res) => {
  const file1 = req.files['file1'][0];
  const file2 = req.files['file2'][0];

  if (!file1 || !file2) {
    return res.status(400).json({ error: 'Both files must be uploaded.' });
  }

  const allowedExtensions = ['txt', 'pdf', 'docx', 'json'];
  const ext1 = file1.originalname.split('.').pop();
  const ext2 = file2.originalname.split('.').pop();

  if (!allowedExtensions.includes(ext1) || !allowedExtensions.includes(ext2)) {
    return res.status(400).json({ error: 'Invalid file type.' });
  }

  const content1 = fs.readFileSync(file1.path, 'utf8');
  const content2 = fs.readFileSync(file2.path, 'utf8');

  const differences = content1 === content2 ? 'No differences' : 'Files are different';

  // Clean up uploaded files
  fs.unlinkSync(file1.path);
  fs.unlinkSync(file2.path);

  res.json({ result: differences });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
