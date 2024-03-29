# ChatterBox
A simple chat app that allows two way communication between users.
Users are asked to create an account. After creation, they can login and search their friend's username and chat with them. This chat application was built on <b>Node.js</b> ,<b>Express.js</b> ,<b>Socket.io</b> and <b>MongoDB</b> as database.

<b>Project created on : 4/03/2022</b>
## Table of Contents
- [Demo](#dem)
- [Reasons for doing this project](#reason)
- [Technology](#Tech)
- [Learning from this project](#learn)
- [Pre-Requisites](#pre)
- [Installation](#ins)
- [Run in developer mode](#run)


## Reasons for doing this project <a id = "reason"></a>
In today's world communicating our thought process to others is the most important skill. I was heavily inspired by the web version of whatsapp and wanted to create my own version of it and also wanted to strengthen my foundational knowledge in Node.js , Express.js and MongoDb through this project.


## Technologies Used <a id = "Tech"></a>
- HTML
- CSS
- Javascript
- Node.js
- Express.js
- Socket.io
- MongoDb

## What did I learn from this project? <a id = "learn"></a>
- Learnt to connect to local and cloud MongoDb database to read and write data.
- Learn to work with npm modules
- Learnt more about advanced CSS.
- Learnt how to render page templates using ejs engine
- Learnt how to create routes using Express.js with GET , POST and DELETE requests
- Learnt how to connect with MongoDb with Mongoose node package module
- Learnt how to use Socket.io to create a real-time bidirectional event-based communication
- Learnt more about responsiveness
- Learnt about express-sessions to maintain the login information


## Pre-requisites <a id = "pre"></a>

To setup and run the project for local development / testing, you will need to use Node.js and NPM. I don't explicitly specify a minimum Node.js/NPM version for the app but I recommend going with whatever the latest LTS version is at the point in time you are setting things up. The minimum vesion of Node.js that I have tested this app on is **10.16.3**.

Installers can be found here: [https://nodejs.org/en/download](https://nodejs.org/en/download/)

Another option for installing Node is the **Node Version Manager** (**nvm**), which is a POSIX-compliant bash script to manage multiple active Node.js versions. Instructions for installing and using nvm to install Node and NPM can be found at [https://github.com/nvm-sh/nvm](https://github.com/nvm-sh/nvm).

## Installation <a id = "ins"></a>

The code for the chat app can be found at the public [GitHub](https://github.com/) repo [https://github.com/owanhunte/nodejs-chat-app](https://github.com/owanhunte/nodejs-chat-app). Either clone the repo to a local folder on your machine or download and extract the archive if you don't have [Git](https://git-scm.com/) installed.

Open a terminal window session, or the equivalent on your machine, and enter the following command to install all the Node modules needed to run the app:

```sh
npm install
```

## Run the app in development mode <a id = "run"></a>

After doing an `npm install` enter the following `npm run` command:

```sh
npm run dev
```

This will start the app and set it up to listen for incoming connections on port 3000. Open up your browser of choice and go to the url [http://localhost:3000/](http://localhost:3000/) to start using the app itself. The `npm run dev` command automatically runs the app using the `nodemon` script so any changes you make to the app's javascript, CSS or HTML code will automatically restart it.

## Customizing the listening port <a id = "dem"></a>

To configure the port that the app listens on at startup, copy the file `.env.example`, located at the root of the project, to `.env` and set an appropriate value for the `PORT` environment variable listed in the file. This must be done before the app is started.

