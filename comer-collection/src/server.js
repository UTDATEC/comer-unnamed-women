import { createServer } from "miragejs"
import logo from './utd_1.jpg';

const dataCard = [
    {
    img: logo,
    title: 'API Test #1',
    },
    {
      img: logo,
      title: 'API Test #2',
    },
    {
      img: logo,
      title: 'API Test #3',
    },
    {
      img: logo,
      title: 'API Test #4',
    //   featured: true,
    },
    {
      img: logo,
      title: 'API Test #5',
    },
    {
      img: logo,
      title: 'API Test #6',
    //   featured: true,
    }
  ];

createServer({
    routes () {
        this.namespace = "api"

        this.get('./photos', () => {
            return { dataCard }
        })
    }
})