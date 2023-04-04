import { createServer } from "miragejs"

export function makeServer() {
  createServer({
    routes() {
      this.get("/api/reminders", () => ({
        reminders: [
            { id: 1, text: "Walk the dog" },
            { id: 2, text: "Take out the trash" },
            { id: 3, text: "Work out" },
          ],
      }))

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