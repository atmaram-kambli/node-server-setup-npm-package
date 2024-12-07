#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const ncp = require('ncp').ncp;

import('chalk').then(chalk => {
  const targetPath = process.cwd(); 
  const templatePath = path.join(__dirname, '../templates');


  function scaffoldProject() {
    console.log(chalk.default.green('Creating a new Node.js server project...'));

    if (fs.existsSync(path.join(targetPath, 'server'))) {
      console.log(chalk.default.red('The project already exists in this directory. Please choose a different location.'));
      return;
    }

    ncp(templatePath, targetPath, function (err) {
      if (err) {
        console.error(chalk.default.red('Error setting up project structure:'), err);
        return;
      }

      console.log(chalk.default.green('Project structure set up successfully!'));
      console.log(chalk.default.green('Run `npm install` to install dependencies.'));
    });
  }

  scaffoldProject();

}).catch(err => {
  console.error('Failed to load chalk:', err);
});
