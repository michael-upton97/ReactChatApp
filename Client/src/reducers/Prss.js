function Prss(state = {}, action) {
   //console.log("Prss reducing action " + action.type);
   switch(action.type) {
   case 'SIGN_IN':
      return action.user;
   case 'SIGN_OUT':
   case 'REGISTER':
      return {};
   default:
      return state;
   }
}

export default Prss;
