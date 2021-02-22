export default function () {
  this.get("/gwr-links", (schema, request) => {
    if (request.queryParams.local_id) {
      return schema.gwrLinks
        .all()
        .filter((link) => link.attrs.id === request.queryParams.local_id);
    }
    return schema.gwrLinks.all();
  });
  this.post("/gwr-links");

  this.passthrough("http://localhost:8010/**");
}
