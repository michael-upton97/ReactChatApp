import * as api from '../api';

export function signIn(credentials, cb) {
   //console.log("in action creator");
   return (dispatch, prevState) => {
      api.signIn(credentials)
      .then((userInfo) => dispatch({type: 'SIGN_IN', user: userInfo}))
      .then(() => {if (cb) cb();})
      .catch(errs => dispatch({type: 'LOGIN_ERR', details: errs}))
   };
}

export function signOut(cb) {
   return (dispatch, prevState) => {
      api.signOut()
      .then(() => dispatch({ type: 'SIGN_OUT' }))
      .then(() => {if (cb) cb();});
   };
}

export function register(data, cb) {
   return (dispatch, prevState) => {
      api.postPrs(data)
      .catch(error => dispatch({type: 'REGISTER_ERR', details: error}))
      .then((userInfo) => dispatch({type: 'REGISTER', user: userInfo}))
      .then(() => {if (cb) cb();})
   };
}

export function updateCnvs(userId, cb) {
   return (dispatch, prevState) => {
      api.getCnvs(userId)
      .then((cnvs) => dispatch({ type: 'UPDATE_CNVS', cnvs: cnvs }))
      .then(() => {if (cb) cb();});
   };
}

export function addCnv(newCnv, userId, cb) {
   return (dispatch, prevState) => {
      //console.log("prepared to request post");
      api.postCnv(newCnv)
      .catch(error => dispatch({type: 'CNV_ERR', details: error}))
      .then(cnvRsp => dispatch({type: 'ADD_CNV', cnv: newCnv}))
      .then(() => {if (cb) cb();})
      .then(() => api.getCnvs(userId))
      .then((cnvs) => dispatch({ type: 'UPDATE_CNVS', cnvs: cnvs }))
      .then(() => {if (cb) cb();});
      
   };
}

export function modCnv(cnvId, userId, title, cb) {
   return (dispatch, prevState) => {
      //console.log("prepared to request put");
      api.putCnv(cnvId, {title})
      .catch(error => dispatch({type: 'CNV_ERR', details: error}))
      .then((cnvId) => dispatch({type: 'EDIT_CNV', data: cnvId}))
      .then(() => {if (cb) cb();})
      .then(() => api.getCnvs(userId))
      .then((cnvs) => dispatch({ type: 'UPDATE_CNVS', cnvs: cnvs }))
      .then(() => {if (cb) cb();});
   };
}

export function deleteCnv(cnvId, userId, cb) {
   return (dispatch, prevState) => {
      //console.log("prepared to request delete");
      api.deleteCnv(cnvId)
      //.then((cnvId) => dispatch({type: 'UPDATE_CNV', data: cnvId}))
      .then(() => {if (cb) cb();})
      .then(() => api.getCnvs(userId))
      .then((cnvs) => dispatch({ type: 'UPDATE_CNVS', cnvs: cnvs }))
      .then(() => {if (cb) cb();});
   };
}

export function getMsgs(cnvId, cb) {
   return (dispatch, prevState) => {
      //console.log("prepared to request get Msgs");
      api.getMsgs(cnvId)
      .then((msgs) => dispatch({ type: 'GET_MESSAGES', msgs: msgs }))
      .then(() => {if (cb) cb();});
   };
}

export function clrMsgs(cnvId) {
   return (dispatch, prevState) => {
      //console.log("prepared to clear Msgs");
      dispatch({ type: 'CLEAR_MESSAGES'});
   };
}

export function addMsg(newMsg, cnvId, cb) {
   return (dispatch, prevState) => {
      //console.log("prepared to request post");
      api.postMsg(cnvId, newMsg)
      .then(cnvRsp => dispatch({type: 'ADD_MSG', msg: newMsg}))
      .then(() => {if (cb) cb();})
      .then(() => api.getMsgs(cnvId))
      .then((msgs) => dispatch({ type: 'GET_MESSAGES', msgs: msgs }))
      .then(() => {if (cb) cb();});
   };
}

export function deleteMsg(msgId, cnvId, cb) {
   return (dispatch, prevState) => {
      //console.log("prepared to request delete");
      api.deleteMsg(msgId)
      //.then((cnvId) => dispatch({type: 'UPDATE_CNV', data: cnvId}))
      .then(() => {if (cb) cb();})
      .then(() => api.getMsgs(cnvId))
      .then((msgs) => dispatch({ type: 'GET_MESSAGES', msgs: msgs }))
      .then(() => {if (cb) cb();});
   };
}

export function clrError() {
   return (dispatch, prevState) => {
      //console.log("prepared to clear Error");
      dispatch({ type: 'CLEAR_ERROR'})
   };
}