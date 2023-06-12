const express = require('express');
const { spawn } = require('child_process');
const cors = require('cors');

const app = express();
app.use(cors());
const port = 3001;

app.use(express.json());

app.post('/compile', (req, res) => {
  console.log('compiling');
  const { command } = req.body;
  const childProcess = spawn(command, { shell: true });

  childProcess.stdout.on('data', (data) => {
    console.log(data.toString());
  });

  childProcess.stderr.on('data', (data) => {
    console.error(data.toString());
  });

  childProcess.on('exit', (code) => {
    if (code === 0) {
      res.status(200).json({ message: 'Command executed successfully.' });
    } else {
      res.status(500).json({ message: 'Command execution failed.' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});