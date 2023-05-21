import axios from "axios";
import {getURL} from "../utils/usefullFunctions";

const REST_URI = getURL() + '/periods';

export default class PeriodsAPI {
    static async get() {
        const response = await axios.get(REST_URI);
        return response
    }

    static async getUnited() {
        const response = await axios.get(REST_URI + '/united');
        return response
    }

    static async post(period) {
        const response = await axios.post(REST_URI, period)
        return response
    }
}