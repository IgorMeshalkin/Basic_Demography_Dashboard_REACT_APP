import axios from "axios";
import {getURL} from "../utils/usefullFunctions";

const REST_URI = getURL() + '/data';

export default class DistrictsAPI {
    static async get(districtID, periodID) {
        const response = await axios.get(REST_URI, {
            params: {
                districtID: districtID,
                periodID: periodID
            }
        }
        );
        return response
    }

    static async update(data) {
        const response = await axios.post(REST_URI, data)
        return response
    }
}