/**
 * Test: models/user_session.js file.
 */
const { dbClient } = require('../../utils/db');
const User = require('../../models/user');
const UserSession = require('../../models/user_session');

describe('UserSession model tests', () => {
  let user, userSession;

  beforeAll(async () => {
    // Create indexes for each collection
    await User.init();
    await UserSession.init();
    console.log('Indexes created for the UserSession model');
  });

  beforeEach(async () => {
    const connection = dbClient.getDatabase();
    await connection.db.dropDatabase();

    // Create a user
    user = await User.createDoc({
      username: 'user1',
      email: 'user1@example.com',
      passwordHash: 'hashed_password',
    });

    // Create a user session for the user
    userSession = await UserSession.createDoc({
      userId: user._id,
      token: 'sample_token',
      isValid: true,
      expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
    });

    console.log('User and user session created before each test');
  });

  afterAll(async () => {
    // Close the connection
    await dbClient.closeDatabase();
  });

  it('should create a new user session successfully', async () => {
    expect.assertions(5); // Expect 5 assertions in this test

    const newUserSessionData = {
      userId: user._id,
      token: 'new_sample_token',
      isValid: true,
      expiresAt: new Date(Date.now() + 7200000), // 2 hours from now
    };

    const newUserSession = await UserSession.createDoc(newUserSessionData);

    expect(newUserSession).not.toBeNull();
    expect(newUserSession.userId.toString()).toBe(user._id.toString());
    expect(newUserSession.token).toBe('new_sample_token');
    expect(newUserSession.isValid).toBe(true);
    expect(new Date(newUserSession.expiresAt).getTime()).toBeGreaterThan(Date.now());
  });

  it('should find a user session by query', async () => {
    expect.assertions(4);

    const foundSession = await UserSession.findOneDoc({ _id: userSession._id });

    expect(foundSession).not.toBeNull();
    expect(foundSession.userId.toString()).toBe(user._id.toString());
    expect(foundSession.token).toBe('sample_token');
    expect(foundSession.isValid).toBe(true);
  });

  it('should update a user session and return the updated version', async () => {
    expect.assertions(2);

    const updatedSession = await UserSession.updateDoc(
      { _id: userSession._id },
      { isValid: false }
    );

    expect(updatedSession).not.toBeNull();
    expect(updatedSession.isValid).toBe(false);
  });

  it('should delete a user session by query', async () => {
    expect.assertions(3);

    const deletedSession = await UserSession.deleteDoc({ _id: userSession._id });

    expect(deletedSession).not.toBeNull();
    expect(deletedSession.token).toBe('sample_token');

    const sessionAfterDelete = await UserSession.findOneDoc({ _id: userSession._id });
    expect(sessionAfterDelete).toBeNull();
  });

  it('should find multiple user sessions with pagination', async () => {
    expect.assertions(2);

    const sessions = await UserSession.findDocs({}, { limit: 2, skip: 0 });

    expect(sessions).toHaveLength(1);
    expect(sessions[0].token).toBe('sample_token');
  });

  it('should throw error if user session not found on update', async () => {
    expect.assertions(1);

    try {
      await UserSession.updateDoc({ _id: 'non-existent-id' }, { isValid: false });
    } catch (error) {
      expect(error.message).toContain('Error updating document:');
    }
  });

  it('should throw error if user session not found on delete', async () => {
    expect.assertions(1);

    try {
      await UserSession.deleteDoc({ _id: 'non-existent-id' });
    } catch (error) {
      expect(error.message).toContain('Error deleting document:');
    }
  });
});
