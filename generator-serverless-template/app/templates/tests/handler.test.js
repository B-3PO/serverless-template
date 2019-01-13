const {
  getAccount,
  getAccounts,
  createAccount,
  createTrial
} = require('../app/handler');


describe('integration', () => {
  const accountId = 1234;

  describe('Create account', () => {
    test('correct greeting is generated', async () => {
      const account = await createAccount({
        body: JSON.stringify({ accountId: accountId })
      });
      const body = JSON.parse(account.body);
      expect(body.account).toBeDefined();
      expect(body.account.id).toBe(accountId);
    });
  });

  describe('Create trial', () => {
    test('correct greeting is generated', async () => {
      const trial = await createTrial({
        body: JSON.stringify({
          accountId: accountId,
          usageCap: 40,
          startDate: Date.now(),
          endDate: Date.now()
        })
      });
      const body = JSON.parse(trial.body);
      expect(body.trial).toBeDefined();
    });
  });

  describe('Create account', () => {
    test('correct greeting is generated', async () => {
      const accounts = await getAccounts({});
      const body = JSON.parse(accounts.body);
      expect(body.accounts).toBeDefined();
      expect(body.accounts.length).toBe(1);
    });
  });

  describe('Get accounts', () => {
    test('correct greeting is generated', async () => {
      const accounts = await getAccounts({});
      const body = JSON.parse(accounts.body);
      expect(body.accounts).toBeDefined();
      expect(body.accounts.length).toBe(1);
    });
  });

  describe('Get account by id', () => {
    test('correct greeting is generated', async () => {
      const account = await getAccount({ pathParameters: { id: accountId } });
      const body = JSON.parse(account.body);
      expect(body.account).toBeDefined();
      expect(body.account.trials).toBeDefined();
      expect(body.account.trials.length).toBe(1);
      expect(body.account.trials[0].accountId).toBe(accountId);
    });
  });
});
