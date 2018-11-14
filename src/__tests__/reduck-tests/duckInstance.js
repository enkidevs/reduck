/* Tests for the Duck instance itself */
import Duck from '../../index';
import { duckAuth, authState } from './test-variables';

const duckInstanceTests = () => {
  test('should warn for duckname that is not of type string', () => {
    expect(() => {
      new Duck(
        {
          duckname: 'auth',
        },
        authState
      );
    }).toThrow(
      'Warning: First argument of Duck should be a string (name of the Duck)'
    );
  });
  test('should have a defineAction method', () => {
    expect(typeof duckAuth.defineAction).toEqual('function');
  });
  test('should have a addReducerCase method', () => {
    expect(typeof duckAuth.addReducerCase).toEqual('function');
  });
  test('should have a reducer method', () => {
    expect(typeof duckAuth.reducer).toEqual('function');
  });
};

export default duckInstanceTests;
