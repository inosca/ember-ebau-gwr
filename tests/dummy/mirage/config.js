import { discoverEmberDataModels } from "ember-cli-mirage";
import { createServer, Response } from "miragejs";

export default function makeServer(config) {
  return createServer({
    ...config,
    models: { ...discoverEmberDataModels(), ...config.models },
    routes() {
      this.namespace = "api/v1";

      this.get("/linker/gwr-links", (schema, request) => {
        if (request.queryParams.local_id) {
          return schema.gwrLinks
            .all()
            .filter(
              (link) =>
                Number(link.attrs.localId) ===
                Number(request.queryParams.local_id),
            );
        }
        return schema.gwrLinks.all();
      });
      this.post("/linker/gwr-links");
      this.delete("/linker/gwr-links/:id");

      let tokenResponse;
      this.post("/housing-stat-token", async (_, request) => {
        if (tokenResponse) {
          return tokenResponse;
        }

        let username;
        let password;
        let municipality;

        if (!request.requestBody) {
          username = localStorage.getItem("username");
          password = localStorage.getItem("password");
          municipality = localStorage.getItem("municipality");

          if (!username && !password && !municipality) {
            return new Response(400, {}, { [400]: { source: "internal" } });
          }
        } else {
          ({ username, password, municipality } = JSON.parse(
            request.requestBody,
          ));
          localStorage.setItem("username", username);
          localStorage.setItem("password", password);
          localStorage.setItem("municipality", municipality);
        }

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
          },
        ).then((response) => response.json());

        tokenResponse = { token, municipality };

        return tokenResponse;
      });

      this.post(
        "/housing-stat-token/logout",
        () => {
          localStorage.removeItem("username");
          localStorage.removeItem("password");
          localStorage.removeItem("municipality");
          localStorage.removeItem("wsk_id");
          tokenResponse = undefined;
        },
        204,
      );

      this.passthrough("http://localhost:8010/**");
    },
  });
}
