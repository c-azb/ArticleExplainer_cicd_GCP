export const API_BASE_URL = "https://vmjz3kafwd4lge2lhu24whhucq0ouiaw.lambda-url.sa-east-1.on.aws"; //"http://127.0.0.1:8000";

export const LOGIN_API_ENDPOINT = API_BASE_URL + "/user/login";
export const LOGOUT_API_ENDPOINT = API_BASE_URL + "/user/logout";
export const REFRESH_API_ENDPOINT = API_BASE_URL + "/user/refresh";
export const REGISTER_API_ENDPOINT = API_BASE_URL + "/user/register";

export const REQUEST_GRAPH_ENDPOINT = API_BASE_URL + "/graph";
export const GET_EXPLANATIONS_ENDPOINT = REQUEST_GRAPH_ENDPOINT + "/explanations";
export const GET_EXPLANATION_ENDPOINT = REQUEST_GRAPH_ENDPOINT + "/explanation";