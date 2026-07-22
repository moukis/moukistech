import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL?.replace(/\/$/, "") || "";
const API_BASE_URL = BACKEND_URL ? `${BACKEND_URL}/api` : "";

const createOfflineApi = () => {
  const mockResponse = (method, url, data) => {
    const path = String(url || "").split("?")[0];

    if (path === "/auth/me") {
      return { data: { id: 1, email: "demo@local.test", name: "Utilisateur local" } };
    }

    if (path === "/auth/login") {
      return {
        data: {
          access_token: "offline-token",
          user: { id: 1, email: "demo@local.test", name: "Utilisateur local" }
        }
      };
    }

    if (path === "/contact") {
      if (method === "get") {
        return { data: [] };
      }
      return { data: { success: true, message: "Message enregistré en mode hors ligne." } };
    }

    if (path === "/blog") {
      return { data: [] };
    }

    if (path.startsWith("/blog/")) {
      const slug = path.replace("/blog/", "");
      return {
        data: {
          id: 1,
          slug,
          title: "Article hors ligne",
          excerpt: "Contenu de secours affiché sans backend.",
          content: "Cet article est affiché en mode hors ligne.",
          created_at: new Date().toISOString(),
          tags: ["offline"]
        }
      };
    }

    if (path === "/contact" && method === "post") {
      return { data: { success: true } };
    }

    return { data: null };
  };

  const request = (method, url, payload) => {
    const response = mockResponse(method, url, payload);
    return Promise.resolve({
      ...response,
      status: 200,
      statusText: "OK",
      config: { method, url }
    });
  };

  return {
    interceptors: {
      request: {
        use: () => {}
      }
    },
    get: (url) => request("get", url),
    post: (url, data) => request("post", url, data),
    put: (url, data) => request("put", url, data),
    patch: (url, data) => request("patch", url, data),
    delete: (url) => request("delete", url)
  };
};

const createRealApi = () => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
  });

  return {
    interceptors: client.interceptors,
    get: (url) => client.get(url),
    post: (url, data) => client.post(url, data),
    put: (url, data) => client.put(url, data),
    patch: (url, data) => client.patch(url, data),
    delete: (url) => client.delete(url),
  };
};

export const api = API_BASE_URL ? createRealApi() : createOfflineApi();

export function formatApiErrorDetail(detail) {
  if (detail == null) return "Une erreur est survenue. Veuillez réessayer.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail))
    return detail.map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e))).filter(Boolean).join(" ");
  if (detail && typeof detail.msg === "string") return detail.msg;
  return String(detail);
}

export default api;
