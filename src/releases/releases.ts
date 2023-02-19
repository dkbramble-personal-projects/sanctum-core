import { Release, Releases } from "./models";

require('dotenv').config()


export const GetReleases = (): string | undefined => {
    // const { data } = await fetch(url)
    // return data
    return process.env.IGDB_CLIENT_ID
}


// function getUsers(): Promise<Release[]> {
//     // For now, consider the data is stored on a static `users.json` file
//     return fetch('/users.json')
//             // the JSON body is taken from the response
//             .then(res => res.json())
//             .then(res => {
//                     // The response has an `any` type, so we need to cast
//                     // it to the `User` type, and return it from the promise
//                     return res as User[]
//             })
// }



// const getIGDBAuthToken = async (): Promise<string> => {
//     var clientID = "";
//     var clientSecret = "";
    
//     var tokenRequestURL = 'https://id.twitch.tv/oauth2/token?client_id=' + clientID + '&client_secret=' + clientSecret + '&grant_type=client_credentials';
//     var response = await fetch(tokenRequestURL, {
//         // learn more about this API here: https://graphql-pokemon2.vercel.app/
//         method: 'POST',
//         headers: {
//           'content-type': 'application/json;charset=UTF-8',
//         },
//     });

//     const {data, errors} = await response.json()

//     if (response.ok){

//     }

//     return ""
// }

// body: JSON.stringify({
//     query: pokemonQuery,
//     variables: {name: name.toLowerCase()},
//   }),

// Promise<String> getAuthToken() async {

//     var clientID = dotenv.env['IGDB_CLIENT_ID'] ?? "";
//     var clientSecret = dotenv.env['IGDB_CLIENT_SECRET'] ?? "";
//     var tokenRequestURL = 'https://id.twitch.tv/oauth2/token?client_id=' + clientID + '&client_secret=' + clientSecret + '&grant_type=client_credentials';
//     final response = await http.post(Uri.parse(tokenRequestURL));
//     if (response.statusCode == 200) {
//       Map<String, dynamic> authTokenResponse = jsonDecode(response.body);
//       return authTokenResponse['access_token'];
//     } else {
//       throw Exception('Failed to get auth token for IGDB');
//     }
//   }