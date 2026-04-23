// import { signIn, signUp, fetchAuthSession } from "aws-amplify/auth";

// export const loginUser = async (email, password) => {
//   await signIn({
//     username: email,
//     password,
//   });

//   const session = await fetchAuthSession();

//   const idToken = session.tokens.idToken.toString();

//   localStorage.setItem("token", idToken);

//   return idToken;
// };

// export const signupUser = async (form) => {
//   await signUp({
//     username: form.email,
//     password: form.password,
//     options: {
//       userAttributes: {
//         email: form.email,
//         name: form.name,
//         phone_number: "+91" + form.mobile,
//       },
//     },
//   });
// };