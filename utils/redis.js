/*
 * Module defines class RedisClient to be used in session management.
 */
import { createClient } from 'redis';

class RedisClient {
    constructor() {
	// Initialize class
	this.client = createClient({
	    url: 'https://127.0.0.1:6379',
	});

	// Flag to handle redis connection
	this.connected = false;

	// Check if connection is successful
	this.client.on('connect', () => {
	    this.connected = true;
	});

	// If not successful
	this.client.on('error', (err) => {
	    console.log(err);
	});
    }
/*
 * Checks if connection is successful.
 */
    isAlive() {
	return this.connected;
    }

/**
 * Set user token, its value (userId).
 */
    async set(key, value, duration) {
      try {
       const result = await new Promise((resolve, reject) => {
	   this.client.set(key, value, 'EX', duration, (err, reply) => {
	       if (err) reject(err);
	       else resolve(reply);
	   });
       });
	  return result;
      } catch(err) {
	  return null;
      }
    }

/**
 * Get userId using token
 */
       async get(key) {
	   try {
	       const value = await new Promise((resolve, reject) => {
		   this.client.get(key, (err, result) => {
		       if (err) reject(err);
		       else resolve(result);
		   });
	       });
	       return value;
	   } catch (err) {
	       return null;
	   }
       }

    async del(key) {
	try {
	    const result = await new Promise((resolve, reject) => {
		this.client.del(key, (err, reply) => {
		    if (err) reject(err);
		    else resolve(reply);
		});
	    })
	    return result
	} catch (error) {
			 return null;
			}
    }    
}
    
