# Bitvavo Assesment

The Bitvavo assement was to create a listing of all markets for their customers and update the  required data in realtime.

## Development

To start up the development server run `npm run dev`

## Production run

To build the app for production run `npm run build`.
And to locally preview the production buil run `npm run preview`. Do not use this as a production server as it's not designed for it.

More on building for production with Vite [here](https://vitejs.dev/guide/build)


## Setup
This setup is using the following technologies:
- React
- Typescript
- Vite 
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
- Eslint
- Prettier


## Sidenotes
- The WebSocket part was the most challenging part for me therefore I didn't really spend too much time on the responsiveness or unit tests. Since those things I already did a lot during my career and I could demonstrate those from my current freelance assignment.
- The code contains some TODO and FIXME comments of things I didnt completely get to. 
- The code uses a custom hook called useSocket. Normally I would use a library like react-use-websocket or so, which already deals with a lot of things like reconnecting and retrying. For the purpose of this test I made a hook myself.
- I did not get to the unit tests yet but I have a lot of code of my current project where I wrote about 100+ unit tests
- It is reasonably responsive
- I tried to use [https://bitvavo.com/en/markets](https://bitvavo.com/en/markets) as an inspiration
- It was really fun to do and I learned a lot. Especially the moment I found out React 18 was running in StrictMode which obviously caused double effects and unmounts on load, making working with Websockets really challenging.
