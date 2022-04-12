import logo from './utd.jpg';

import { createServer } from "miragejs"

createServer({
  routes() {
    this.urlPrefix = 'http://localhost:3000';
    this.namespace = "api"

    this.get("/photoData", () => {
      return {
        movies: [
          { id: 1, img: logo, title: "Sarah in the Jungle" },
          { id: 2, img: logo, title: "Tamm in the Jungle" },
          { id: 3, img: logo, title: "Stephanie in the Jungle" },
        ],
      }
    })
  },
})

async function getUsers() {
    try {
        let res = await fetch("/photoData");
        console.log(res);
        return await res.json();

    } catch (error) {
        console.log(error);
    }
}

async function renderUsers() {
    let users = await getUsers();
    let myTileData = [];
    users.forEach(user=> {
      myTileData.push({img: logo, title: user.title});
    });

    return myTileData;
}

let tileData = renderUsers();

console.log(tileData);
export default tileData;

// const tileData = [
//     {
//     img: logo,
//     title: 'Sarah in the Jungle',
//     },
//     {
//       img: logo,
//       title: 'Sarah in the Jungle',
//     featured: true,
//     },
//     {
//       img: logo,
//       title: 'Sarah in the Jungle',
//     },
//     {
//       img: logo,
//       title: 'Sarah in the Jungle',
//     },
//     {
//       img: logo,
//       title: 'Sarah in the Jungle',
//     },
//     {
//       img: logo,
//       title: 'Sarah in the Jungle',
//     },
//   ];
//
//   export default tileData;
