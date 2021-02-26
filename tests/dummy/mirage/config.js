export default function () {
  this.namespace = "/api/v1";
  this.get("/linker/gwr-links", (schema, request) => {
    if (request.queryParams.local_id) {
      return schema.gwrLinks
        .all()
        .filter((link) => link.attrs.id === request.queryParams.local_id);
    }
    return schema.gwrLinks.all();
  });
  this.post("/linker/gwr-links");
  this.get("/linker/gwr-links");

  this.passthrough("http://localhost:8010/**");
}
