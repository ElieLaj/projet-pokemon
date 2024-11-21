import axios from "axios";

class API {
  private axios: any;
  constructor() {
    this.axios = axios.create({
      baseURL: "http://localhost:8081/api/v1/",
    });
  }

  async get(url: string) {
    return await this.axios.get(url);
  }

  async post(url: string, data: object) {
    return await this.axios.post(url, data);
  }

  async put(url: string, data: object) {
    return await this.axios.put(url, data);
  }

  async delete(url: string) {
    return await this.axios.delete(url);
  }

  async patch(url: string, data: object) {
    return await this.axios.patch(url, data);
  }
}

export const api = new API();

