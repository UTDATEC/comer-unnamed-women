import { TextField, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

const SearchBox = (props) => {
    const { searchQuery, setSearchQuery, width, placeholder } = props;

    return (
        <TextField variant="outlined" placeholder={placeholder ?? "Search"} value={searchQuery} sx={{width}}
            onChange={(e) => {
              setSearchQuery(e.target.value)
            }}
            InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton sx={{
                  display: searchQuery == "" ? "none" : ""
                }} onClick={() => {
                  setSearchQuery("");
                }}>
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            )
        }}></TextField>
    )
}

export default SearchBox