import duckInstanceTests from "./reduck-tests/duckInstance";
import defineActionInputTests from "./reduck-tests/defineAction-input";
import addReducerCaseInputTests from "./reduck-tests/addReducerCase-input";
import duckMethods from "./reduck-tests/duckMethods";
import middleWare from "./redux-tests/middleware";

describe("reduck", () => {
  // force console.error to throw an error -> warning does not throw errors like invariant
  console.error = jest.fn(error => {
    throw new Error(error);
  });
  describe("the duck instance", () => {
    duckInstanceTests();
  });
  describe("the duck instance methods", () => {
    duckMethods();
  });
  describe("invalid defineAction inputs", () => {
    defineActionInputTests();
  });
  describe("invalid addReducerCase inputs", () => {
    addReducerCaseInputTests();
  });
  describe("middleware", () => {
    middleWare();
  });
});
