import { Response } from "miragejs";

export default function () {
  this.namespace = "api/v1";

  this.get("/linker/gwr-links", (schema, request) => {
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
  this.post("/linker/gwr-links");
  this.delete("/linker/gwr-links/:id");

  let gwrToken;
  this.post("/housing-stat-token", async (_, request) => {
    if (gwrToken) {
      return gwrToken;
    }

    if (!request.requestBody) {
      return new Response(400, {}, { [400]: { source: "internal" } });
    }

    const { username, password, municipality } = JSON.parse(
      request.requestBody
    );
    //eslint-disable-next-line no-alert
    const wsk_id = localStorage.getItem("wsk_id") || prompt("wsk_id:");
    if (wsk_id) {
      localStorage.setItem("wsk_id", wsk_id);
    }

    const { token } = await fetch(
      `http://localhost:8010/proxy/regbl/api/ech0216/2/tokenWS`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          wsk_id: Number(wsk_id),
        }),
      }
    ).then((response) => response.json());

    gwrToken = token;

    return JSON.stringify({ token: gwrToken, municipality });
  });

  this.passthrough("http://localhost:8010/**");
}
