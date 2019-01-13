export default function Cnvs(state = [], action) {
   //console.log("Msgs reducing action " + action.type);

   switch (action.type) {
      case 'GET_MESSAGES':
         return state.concat(action.msgs);
      case 'CLEAR_MESSAGES':
         return [];
      case 'ADD_MESSAGE':
         return state.concat(action.msg);
      default:
         return state;
   }
}