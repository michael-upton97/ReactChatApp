export default function Errs(state = {}, action) {
   //console.log("Errs reducing action " + action.type);

   switch (action.type) {
      case 'LOGIN_ERR': // 
      case 'REGISTER_ERR': // 
      case 'CNV_ERR': // 
         return action.details;
      case 'CLEAR_ERROR':
         return {};
      default:
         return state;
   }
}