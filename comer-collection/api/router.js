const createError = require('http-errors');
const express = require("express");
const router = express.Router();


const { listImages, createImage, getImage, updateImage, deleteImage, assignArtistToImage, unassignArtistFromImage, assignTagToImage, unassignTagFromImage, getTags } = require("./controllers/images.js");
const { listArtists, createArtist, getArtist, updateArtist, deleteArtist } = require("./controllers/artists.js");
const { listTags, createTag, updateTag, deleteTag } = require("./controllers/tags.js");
const { listUsers, createUser, updateUser, deleteUser, getUser } = require("./controllers/users.js");
const { changePassword } = require("./controllers/change_password.js")
const { signIn } = require("./controllers/sign_in.js")


router.get("/images", listImages);
router.post("/images", createImage);
router.get("/images/:imageId", getImage)
router.put("/images/:imageId", updateImage);
router.delete("/images/:imageId", deleteImage);
router.put("/images/:imageId/artist/:artistId", assignArtistToImage);
router.delete("/images/:imageId/artist/:artistId", unassignArtistFromImage);
router.get("/images/:imageId/tag", getTags)
router.put("/images/:imageId/tag/:tagId", assignTagToImage);
router.delete("/images/:imageId/tag/:tagId", unassignTagFromImage);

router.get("/artists", listArtists);
router.post("/artists", createArtist);
router.get("/artists/:artistId", getArtist);
router.put("/artists/:artistId", updateArtist);
router.delete("/artists/:artistId", deleteArtist);

router.get("/tags", listTags);
router.post("/tags", createTag);
router.put("/tags/:tagId", updateTag)
router.delete("/tags/:tagId", deleteTag)

router.get("/users", listUsers);
router.post("/users", createUser);
router.put("/users/:userId", updateUser)
router.delete("/users/:userId", deleteUser)
router.put("/getUser", getUser)

router.put("/changePassword", changePassword);

router.put("/signIn", signIn);

router.use(["/images", "/artists", "/tags", "/users", "/sign_up", "/change_password"], (req, res, next) => {
    next(createError(405));
})


module.exports = router;