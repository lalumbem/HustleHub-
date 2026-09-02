// In-memory user store for Part 1 of the assessment.
// The requirements explicitly allow in-memory/file-based storage at this
// stage, with MongoDB introduced later. Swapping this module out for a
// real Mongoose model later should not require changes to the controllers,
// as long as the same shape (id, name, email, password, role) is kept.

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} email - always stored lower-cased
 * @property {string} password - bcrypt hash, never the plain text value
 * @property {"client"|"freelancer"} role
 */

/** @type {User[]} */
const users = [];

module.exports = users;
