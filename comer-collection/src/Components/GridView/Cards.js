import React, { useEffect, useState } from 'react';


const UsingFetch = () => {
  const [images, setImages] = useState([])

  const fetchData = () => {
    fetch("http://localhost:9000/testAPI/searchBy")
      .then(response => {
        return response.json()
      })
      .then(data => {
        setImages(data)
      })
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div>
      {images.length > 0 && (
        <ul>
          {images[0].map(image => (
            //console.log(image)
            
            //<h1>[{image[0].title}]</h1>
            
            <li key="{image[0].title}">{image.title}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default UsingFetch