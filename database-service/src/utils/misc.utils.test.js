const { createAndUpdateRules } = require('./misc.utils');

describe('create and update rules', () => {
  it('return correct value', () => {
    const res = createAndUpdateRules(() => {});
    expect(res.length).toBeTruthy();
  });
});
