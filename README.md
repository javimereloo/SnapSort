# [SnapSort](snapsort.glitch.me)
SnapSort is [Node.js](https://nodejs.org/en/about) webapp developed for my Final Degree Project. In a nutshell is a virtual gallery that allows you to sort images that you import from cloud services, such as Google Drive.


## What's in this project?
- `public/`: You will find the styling rules for the pages.

- `server.js`: Is the main server script for the web site. Raise the server and define the routes

- `src/`: This folder contains page templates, additional scripts and files necessary for the correct working of the server.

### Working in the `src/` folder 📁

- `src/GoogleDrive/googleAPI.js`: In this file you will find all the necessary functions for communication with the Google API.
- `src/database`: This folder contains the configuration, the basic communication methods and the sqlite3 database itself.
- `src/pages`: Collects the HandleBars templates that define the structure of the different views.
- `src/routes`: In this folder are defined the Fastify's routes for the basic interaction with the server.




## I built this with Glitch! ![Glitch](https://cdn.glitch.com/a9975ea6-8949-4bab-addb-8a95021dc2da%2FLogo_Color.svg?v=1602781328576)
[Glitch](https://glitch.com/) is an online webapp development platform, offering a collaborative and accessible development environment that allows applications to be developed quickly and easily.

