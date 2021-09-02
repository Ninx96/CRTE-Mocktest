export const initialState = {
  exam_id: null,
  user: null,
};

const Reducer = (state, action) => {
  console.log(action);
  switch (action.type) {
    case "LOAD_EXAM":
      return {
        ...state,
        exam_id: action.exam_id,
      };

    case "LOGIN_USER":
      return {
        ...state,
        user: action.user,
      };

    case "LOGOUT_USER":
      return {
        ...state,
        user: null,
      };

    default:
      return state;
  }
};

export default Reducer;
