//src/utils/apiResponse.js

/**
 * API response object.
 * @param {number} statusCode - HTTP status code.
 * @param {Object} data - Data to be sent in the response.
 * @param {string} message - Response message.
 */

function ApiResponse(statusCode, data, message) {
  this.statusCode = statusCode;
  this.data = data;
  this.message = message || 'Success';
  this.success = statusCode < 400;
}

module.exports = ApiResponse;
