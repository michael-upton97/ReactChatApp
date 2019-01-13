// Orderly interface to the REST server, providing:
// 1. Standard URL base
// 2. Standard headers to manage CORS and content type
// 3. Guarantee that 4xx and 5xx results are returned as
//    rejected promises, with a payload comprising an
//    array of user-readable strings describing the error.
// 4. All successful post operations return promises that
//    resolve to a JS object representing the newly added
//    entity (all fields, not just those in the post body)
// 5. Signin and signout operations that retain relevant
//    cookie data.  Successful signin returns promise 
//    resolving to newly signed in user.

const baseURL = "http://localhost:2004/";
const headers = new Headers();
var cookie;

headers.set('Content-Type', 'application/JSON');

const reqConf = {
   headers: headers,
   mode: "cors",
   //redirect: "follow",
   credentials: 'include'
};

var safeFetch = (input, init) => {
   return fetch(input, init)
   .then((myPromise) => {return myPromise})
   .catch(()  => {return Promise.reject("Server Connect Error")})
   .then((myPromise) => {
      switch (myPromise.status) {
         case 200:
            return myPromise
         case 400: 
            return Promise.reject("BadRequest");
         case 401: 
            return Promise.reject("PermissionDenied");
         case 403: 
            return Promise.reject("Fobidden");
         case 500: 
            return Promise.reject("InternalServerError");
         default:
            return Promise.reject("UnknownStatusError");
      }
   })
}
// Helper functions for the comon request types, automatically
// adding verb, headers, and error management.
export function post(endpoint, body) {
   //console.log(body);
   return safeFetch(baseURL + endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
      ...reqConf
   });
}

export function put(endpoint, body) {
   //console.log("PUT request id: " + JSON.stringify(endpoint));
   //console.log("PUT request body: " + JSON.stringify(body));
   return safeFetch(baseURL + endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
      ...reqConf
   });
}

export function get(endpoint) {
   return safeFetch(baseURL + endpoint, {
      method: 'GET',
      ...reqConf
   });
}

export function del(endpoint) {
   return safeFetch(baseURL + endpoint, {
      method: 'DELETE',
      ...reqConf
   });
}

// Functions for performing the api requests

/**
 * Sign a user into the service, returning a promise of the 
 * user data
 * @param {{email: string, password: string}} cred
 */
export function signIn(cred) {
   //console.log("in api");
   return post("Ssns", cred)
      .catch((err) => {if(err === "BadRequest") throw "Incorrect Email/Password"; else throw "Error: " + err})
      .then((response) => {
         let location = response.headers.get("Location").split('/');
         cookie = location[location.length - 1];
         return get("Ssns/" + cookie);
      })
      .then(response => response.json())   // ..json() returns a Promise!
      .then(rsp => get('Prss/' + rsp.prsId))
      .then(userResponse => userResponse.json())
      .then(rsp => rsp[0]);
}

/**
 * @returns {Promise} result of the sign out request
 */
export function signOut() {
   return del("Ssns/" + cookie);
}

/**
 * Register a user
 * @param {Object} user
 * @returns {Promise resolving to new user}
 */
export function postPrs(user) {
   return post("Prss", user)
   .catch((err) => {if(err === "BadRequest") throw "Account Already Exists"; else throw "Error: " + err})
   .then((rsp) => {
      let location = rsp.headers.get("Location").split('/');
      return location[location.length - 1];
   })
   //.then(rsp => rsp.json());
}

/**
 * @returns {Promise} json parsed data
 */
export function getCnvs(userId) {
   return get("Cnvs" + (userId ? "?owner="+userId : ""))
   .then((res) => res.json())
}

export function putCnv(id, body) {
   //console.log("calling put");
   return put(`Cnvs/${id}`, body)
   .catch((err) => {if(err === "BadRequest") throw "Duplicate Conversation Name"; else throw "Error: " + err})  
}

export function postCnv(body) {
   //console.log("calling post");
   return post('Cnvs', body)
   .catch((err) => {if(err === "BadRequest") throw "Duplicate Conversation Name"; else throw "Error: " + err})
   .then(rsp => {
      let location = rsp.headers.get("Location").split('/');
      return get(`Cnvs/${location[location.length-1]}`);
   })
   .then(rsp => rsp.json());
}

export function postMsg(cnvId, body) {
   //console.log("calling post");
   return post(`Cnvs/${cnvId}/Msgs`, body).then(rsp => {
      let location = rsp.headers.get("Location").split('/');
      return get(`Msgs/${location[location.length-1]}`);
   })
   .then(rsp => rsp.json());
}

export function deleteCnv(id) {
   //console.log("calling delete");
   return del(`Cnvs/${id}`)
 }

 export function getMsgs(cnvId) {
   return get(`Cnvs/${cnvId}/Msgs`)
   .then((res) => res.json())
}

export function deleteMsg(id) {
   //console.log("calling delete");
   return del(`Msg/${id}`)
 }

const errMap = {
   en: {
      missingField: 'Field missing from request: ',
      badValue: 'Field has bad value: ',
      notFound: 'Entity not present in DB',
      badLogin: 'Email/password combination invalid',
      dupEmail: 'Email duplicates an existing email',
      noTerms: 'Acceptance of terms is required',
      forbiddenRole: 'Role specified is not permitted.',
      noOldPwd: 'Change of password requires an old password',
      oldPwdMismatch: 'Old password that was provided is incorrect.',
      dupTitle: 'Conversation title duplicates an existing one',
      dupEnrollment: 'Duplicate enrollment',
      forbiddenField: 'Field in body not allowed.',
      queryFailed: 'Query failed (server problem).'
   },
   es: {
      missingField: '[ES] Field missing from request: ',
      badValue: '[ES] Field has bad value: ',
      notFound: '[ES] Entity not present in DB',
      badLogin: '[ES] Email/password combination invalid',
      dupEmail: '[ES] Email duplicates an existing email',
      noTerms: '[ES] Acceptance of terms is required',
      forbiddenRole: '[ES] Role specified is not permitted.',
      noOldPwd: '[ES] Change of password requires an old password',
      oldPwdMismatch: '[ES] Old password that was provided is incorrect.',
      dupTitle: '[ES] Conversation title duplicates an existing one',
      dupEnrollment: '[ES] Duplicate enrollment',
      forbiddenField: '[ES] Field in body not allowed.',
      queryFailed: '[ES] Query failed (server problem).'
   },
   swe: {
      missingField: 'Ett fält saknas: ',
      badValue: 'Fält har dåligt värde: ',
      notFound: 'Entitet saknas i DB',
      badLogin: 'Email/lösenord kombination ogilltig',
      dupEmail: 'Email duplicerar en existerande email',
      noTerms: 'Villkoren måste accepteras',
      forbiddenRole: 'Angiven roll förjuden',
      noOldPwd: 'Tidiagre lösenord krav för att updatera lösenordet',
      oldPwdMismatch: 'Tidigare lösenord felaktigt',
      dupTitle: 'Konversationstitel duplicerar tidigare existerande titel',
      dupEnrollment: 'Duplicerad inskrivning',
      forbiddenField: 'Förbjudet fält i meddelandekroppen',
      queryFailed: 'Förfrågan misslyckades (server problem).'
   }
}

/**
 * @param {string} errTag
 * @param {string} lang
 */
export function errorTranslate(errTag, lang = 'en') {
   return errMap[errTag] || 'Unknown Error!';
}
