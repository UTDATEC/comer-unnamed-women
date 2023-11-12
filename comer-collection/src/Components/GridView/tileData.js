import logo from '../GridView/utd.jpg';

const tileData = [];


const fetchData = () => {
  fetch("http://localhost:9000/api/images")
  .then(response => {
      return response.json();
  })
  .then(data => {
    //console.log(data)
      // Here you need to use an temporary array to store NeededInfo only 
      const prefix = "https://atecquilt01.utdallas.edu/comer/public/images/";
      for (var i = 0; i < data.length; i++) {
          let img_fname = data[i].image_file_name
          let url = "";
          //console.log(img_fname)
          if (!img_fname) {
            url = logo
          } else {
            img_fname = img_fname.replace(/ /g,"%20");
            url = prefix + img_fname
          }
          console.log(url)
          tileData.push({
            img: url,
            title: data[i].title,
            // artist: data[i].artist,
            year: data[i].date,
            medium: data[i].medium,
            // dimensions: data[i].dimensions,
          })
      }
  });
};

fetchData()
export default tileData;