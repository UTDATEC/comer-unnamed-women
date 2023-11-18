import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchBox = (props) => {
    const { searchQuery, setSearchQuery, width } = props;

    return (
        <TextField variant="outlined" placeholder="Search" value={searchQuery} sx={{width}}
            onChange={(e) => {
              setSearchQuery(e.target.value)
            }}
            InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
        }}></TextField>
    )
}

export default SearchBox