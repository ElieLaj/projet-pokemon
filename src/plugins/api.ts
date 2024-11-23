import axios from "axios";
import { environment }  from "../environments/environment";

class API {
  private axios: any;
  constructor(apiUrl:string, apiKey: string) {
    this.axios = axios.create({
      baseURL: apiUrl,
      headers: {
        'X-API-KEY': apiKey
      },
    });
  }

  async get(url: string) {
    try {
      
      console.log("GET Request URL:", url);
      return await this.axios.get(url);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("GET Request Failed:", error.response?.data || error.message);
      } else {
        console.error("GET Request Failed:", error);
      }
      throw error;
    }
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

export const api = new API(environment.apiURL, environment.apiKey);

