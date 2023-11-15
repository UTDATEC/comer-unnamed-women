import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Table.css';
import { useNavigate } from 'react-router-dom';
import { Button, IconButton, Paper, Stack, TableContainer, styled } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'


const PREFIX = 'ImageList';

const classes = {
  root: `${PREFIX}-root`,
  tableText: `${PREFIX}-tableText`,
  options: `${PREFIX}-options`,
  icon: `${PREFIX}-icon`,
};


const Root = styled('div')((
  {
    theme
  }
) => ({
  [`& .${classes.tableText}`]: {
    fontSize: '14px',
    align: "left"
  },
  [`& .${classes.options}`]: {
    fontSize: '20px',
    align: "right",
    width: '50px'
  },
  [`& .${classes.icon}`]: {
    fontSize: '20px',
  },
}));

function ImageList() {
  const [images, setImages] = useState([]);

  const navigate = useNavigate();

  const imageColumns = {
    id: "ID",
    accessionNumber: "Accession Number",
    title: "Title",
    year: "Year",
    medium: "Medium",
    subject: "Subject"
  }

  // const ImageRow = (image) => {
  //   console.log("image", image);
  //   return 
  // }

  useEffect(() => {
    const fetchData = async() => {
      let response = await axios.get('http://localhost:9000/api/images')
      setImages(response.data);
      console.log('Images:', response.data);
    };
    
    fetchData();
  }, []);

  return (
    <div className='ListContainer'>
      <Root className='TableContainer'>
        <TableContainer component={Paper} >
          <Table size="small" aria-label="test table">
            <TableHead sx={{ '& th': {fontWeight: "bold"}, '&': { backgroundColor: "lightgray" } }} >
              <TableRow>
                {Object.keys(imageColumns).map((col) => (
                  <TableCell className={classes.tableText}>
                    {imageColumns[col]}
                  </TableCell>
                ))}
                <TableCell>&nbsp;</TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx = {{ '& tr:hover': { backgroundColor: "#EEE"} }}>
              {images.data?.map((image) => (
              <TableRow key={image.id} >
                {Object.keys(imageColumns).map((col) => (
                  <TableCell className={classes.tableText}>
                    {image[col]}
                  </TableCell>
                ))}
                <TableCell className={classes.options}>
                  <Stack direction="row">
                    <IconButton color="primary" variant="contained" size="small" onClick={() => {
                      navigate(`../ImageEdit/${image.id}`);
                    }}><EditIcon className={classes.icon}/></IconButton>
                    <IconButton color="primary" disabled variant="contained" size="small"><DeleteIcon className={classes.icon} /></IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ) )}
            </TableBody>
          </Table>
        </TableContainer>
        
      </Root>
    </div>
  );
}

export default ImageList;
