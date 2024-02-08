import { TextField, InputAdornment, IconButton } from "@mui/material";
import { SearchIcon, ClearIcon } from "../../IconImports";

const SearchBox = (props) => {
    const { searchQuery, setSearchQuery, width, placeholder } = props;

    return (
        <TextField variant="outlined" placeholder={placeholder ?? "Search"} value={searchQuery} sx={{width}}
            onChange={(e) => {
              setSearchQuery(e.target.value)
            }}
            InputProps={{
              sx: {
                height: "100%"
              },
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