import axios from "axios";
import {getURL} from "../utils/usefullFunctions";

const REST_URI = getURL() + '/users';

export default class AuthAPI {
    static async isCorrectPassword(data) {
        const response = await axios.post(REST_URI, data)
        return response
    }
}