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

// update react static files
app.post('/webhook', (req, res) => {

  // WHAT TO DO!
  // pull the files from repo, run build, swap files with
  // new ones inside /var/www/mirkomassa.com
  const buildDirectory = '/var/mirkomassa.com-code/wassmts-gui';
  // const targetDirectory = '/var/www/mirkomassa.com';
  const options = {
    cwd: buildDirectory
  };
  // Pull the latest changes from the repository
  childProcess.exec('./webhook.sh',
   options, (pullError, pullStdout, pullStderr) => {
    if (pullError) {
      console.error(`Error during Git pull: ${pullError.message}`);
      res.sendStatus(500);
      return;
    }
    if (pullStderr) {
      console.error(`Git pull error: ${pullStderr}`);
      res.sendStatus(500);
      return;
    }
  });
  // npm install just in case
  // childProcess.exec('npm install', options, (error, stdout, stderr) => {
  //   if (error) {
  //     console.error(`Error during npm install: ${error.message}`);
  //     res.sendStatus(500);
  //     return;
  //   }
  //   if (stderr) {
  //     console.error(`Npm install stderror: ${stderr}`);
  //     res.sendStatus(500);
  //     return;
  //   }
  //   // npm run build of static react files
  //   const buildProcess = spawn('npm', ['run', 'build'], options);
    
  //   buildProcess.stdout.on('data', (data) => {
  //     console.log(`Build output: ${data}`);
  //   });

  //   buildProcess.stderr.on('data', (data) => {
  //     console.error(`Build error: ${data}`);
  //   });

  //   buildProcess.on('error', (error) => {
  //     console.error(`Error during build: ${error.message}`);
  //     res.sendStatus(500);
  //   });

  //   buildProcess.on('close', (code) => {
  //     if (code === 0) {
  //       console.log('Build successful.');

  //       // Swap the new build files with the existing ones
  //       try {
  //         fs.readdirSync(targetDirectory).forEach((file) => {
  //           const filePath = path.join(targetDirectory, file);
  //           fs.unlinkSync(filePath);
  //         });

  //         fs.readdirSync(buildDirectory).forEach((file) => {
  //           const sourcePath = path.join(buildDirectory, file);
  //           const targetPath = path.join(targetDirectory, file);
  //           fs.copyFileSync(sourcePath, targetPath);
  //         });

  //         console.log('File swap successful.');
  //         res.sendStatus(200);
  //       } catch (error) {
  //         console.error(`Error during file swap: ${error.message}`);
  //         res.sendStatus(500);
  //       }
  //     } else {
  //       console.error(`Build process exited with code ${code}`);
  //       res.sendStatus(500);
  //     }
  //   });
  // });
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