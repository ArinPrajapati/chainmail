/**
 * HTTP Node - Makes HTTP requests with templated URL, headers, body
 */

import { createNode } from './baseNode.js';

export const httpNode = createNode(async (parameters, flowStore) => {
    const {
        method = 'GET',
        url,
        headers = {},
        body = null
    } = parameters;

    if (!url) {
        throw new Error('HTTP Node: url is required');
    }

    const fetchOptions = {
        method: method.toUpperCase(),
        headers: {
            'Content-Type': 'application/json',
            ...headers
        }
    };

    // Add body for methods that support it
    if (body && !['GET', 'HEAD'].includes(fetchOptions.method)) {
        fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    const response = await fetch(url, fetchOptions);

    const responseData = {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
    };

    // Try to parse as JSON, fall back to text
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
        responseData.data = await response.json();
    } else {
        responseData.data = await response.text();
    }

    // Throw error for non-2xx responses (can be caught by executor's error handling)
    if (!response.ok) {
        const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
        error.response = responseData;
        throw error;
    }

    return responseData;
});
