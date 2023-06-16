const express = require('express');
const path = require('path');
const fs = require('fs');
const fileUpload = require('express-fileupload');
const childProcess = require('child_process');
const { exec, spawn } = require('child_process');
const cors = require('cors');

const port = 3001;
const app = express();
app.use(cors());
app.use(express.json());


app.use(fileUpload());

app.get('/', (req, res) => {
  res.send(`hello: ${new Date()}.`);
})

// update react static files & server
app.post('/webhook', (req, res) => {

  const buildDirectory = '/var/mirkomassa.com-code/wassmts-gui';
  // const targetDirectory = '/var/www/mirkomassa.com';
  const options = {
    cwd: buildDirectory
  };
  childProcess.exec('./webhook.sh', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error during script execution: ${error.message}`);
      res.sendStatus(500);
      return;
    }
    if (stderr) {
      console.error(`Stderror: ${stderr}`);
      res.sendStatus(500);
      return;
    }
  });
  childProcess.exec('ps aux | grep node', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error during ps execution: ${error.message}`);
      res.sendStatus(500);
      return;
    }
    if (stderr) {
      console.error(`Ps stderror: ${stderr}`);
      res.sendStatus(500);
      return;
    }
    console.log('pid:',stdout);
  });

});

// uploading temporary .ts file, compiled to wat and wasm and
// then deleted from the temp folder.
app.post('/uploadTemp', (req, res) => {
    // checking if there are passed files
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }
    const file = req.files.file;
    // console.log('file:', file);
    // mv() method saves the file
    file.mv('tempFiles/' + file.name, (err) => {
      if (err) {
        console.log(err)
        return res.status(500).send(err);
      }
      // console.log('stored', file)
      res.send('File uploaded successfully');
    });
  });

app.post('/tscompile', (req, res) => {
  const {fileName} = req.body;
  const fileNameNoExt = fileName.slice(0, fileName.length-3);
  const filePath = `tempFiles/${fileName}`;
  const command = 
  `asc ${filePath} -o tempFiles/${fileNameNoExt}.wasm -t tempFiles/${fileNameNoExt}.wat`;

  console.log('extension', fileNameNoExt, ',path', filePath, ',command', command);

  const child = childProcess.spawn(command, { shell: true });

  console.log('compiling', fileName);

  child.stdout.on('data', (data) => {
    console.log('data',data.toString());
    res.send(data.toString());
  });

  child.stderr.on('data', (data) => {
    console.log('error')
    console.error(data.toString());
  });

  child.on('exit', (code) => {
    if (code === 0) {
      res.status(200).json({ message: 'Command executed successfully.' });
    } else {
      res.status(500).json({ message: 'Command execution failed.' });
    }
  });

});

app.get('/compiledFiles', (req, res) => {
  let {fileName} = req.body;
  fileName = fileName.slice(0, fileName.length-3);
  console.log('getting', fileName);
  const filePath = path.join(__dirname, 'tempFiles', `${fileName}.pdf`);
  res.sendFile(filePath);
});

app.use(express.static(path.join(__dirname, 'tempFiles')));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});