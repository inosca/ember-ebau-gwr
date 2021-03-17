export default function () {
  this.get("/gwr-links", (schema, request) => {
    if (request.queryParams.local_id) {
      return schema.gwrLinks
        .all()
        .filter(
          (link) =>
            Number(link.attrs.localId) === Number(request.queryParams.local_id)
        );
    }
    return schema.gwrLinks.all();
  });
  this.post("/gwr-links");
  this.delete("/gwr-links/:id");

  this.passthrough("http://localhost:8010/**");
}
