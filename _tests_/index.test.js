describe('reduck', () => {
  describe('should make sure the action object is valid', () => {
    test('should throw for invalid action object', () => {

    })
    test('should throw for invalid creator method', () => {

    })
  })
  describe('should make sure the action type name is valid', () => {
    test('should throw for invalid type', () => {

    })
    test('should warn for action not prefixed by the duck name', () => {

    })
  })
  test('should warn for duplicate action definition', () => {

  })
  describe('should handle invalid reducer cases', () => {
    test('should warn for duplicate reducer case', ()=> {

    })
    test('should warn for unknown reducer mapping', () => {

    })
    test('should warn for duplicate case', () => {

    })
    test('should console.error for render case with incorrect type', () => {

    })
  })
  test('should warn for duckname that is not of type string', () => {

  })
})
