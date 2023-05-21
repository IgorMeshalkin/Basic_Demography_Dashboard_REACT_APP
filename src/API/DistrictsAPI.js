import axios from "axios";
import {getURL} from "../utils/usefullFunctions";

const REST_URI = getURL() + '/districts';
export default class DistrictsAPI {
    static async get() {
        const response = await axios.get(REST_URI);
        return response
    }
    static async getWithoutData() {
        const response = await axios.get(REST_URI + "/without_data");
        return response
    }

    static async post(data) {
        const response = await axios.post(REST_URI, data)
        return response
    }
}