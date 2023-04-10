import { createServer } from "miragejs"

export function makeServer() {
  createServer({
    routes() {
      this.urlPrefix = 'https://localhost:9000';
      this.get("/testAPI/searchBy", (schema, request, response) => {
        return ["Interstellar", "Inception", "Dunkirk"]
      })

      this.post("/api/post", (schema, request) => {
        let attrs = JSON.parse(request.requestBody)
        console.log(attrs)
      })

      // this.post("/api/betterpost?", function (schema, request) {
      //   let attrs = JSON.parse(request.requestBody).author
  
      //   if (attrs.name) {
      //     return schema.authors.create(attrs)
      //   } else {
      //     return new Response(
      //       400,
      //       { some: "header" },
      //       { errors: ["name cannot be blank"] }
      //     )
      //   }
      // })
    },
  })
}