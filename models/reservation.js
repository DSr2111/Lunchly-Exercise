/** Reservation for Lunchly */

const moment = require("moment");

const db = require("../db");

/** A reservation for a party */

class Reservation {
  constructor({ id, customerId, numGuests, startAt, notes }) {
    this.id = id;
    this.customerId = customerId;
    this.numGuests = numGuests;
    this.startAt = startAt;
    this.notes = notes;
  }

  /** getting and setting number of guests */

  set numGuests(val) {
    if (val < 1) {
      throw new Error("Cannot have fewer than 1 guest");
      this._numGuests = val;
    }
  }
  get numGuests() {
    return this._numGuests;
  }

  /**getting and setting start time */
  set startAt(val) {
    if (val instanceof Date && !isNaN(val)) this._startAt = val;
    else throw new Error("Not a valid startAt");
  }

  get startAt() {
    return this._startAt;
  }
  /** formatter for startAt */

  get formattedStartAt() {
    return moment(this.startAt).format("MMMM Do YYYY, h:mm a");
  }

  /** given a customer id, find their reservations. */

  static async getReservationsForCustomer(customerId) {
    const results = await db.query(
      `SELECT id, 
           customer_id AS "customerId", 
           num_guests AS "numGuests", 
           start_at AS "startAt", 
           notes AS "notes"
         FROM reservations 
         WHERE customer_id = $1`,
      [customerId]
    );

    return results.rows.map((row) => new Reservation(row));
  }

  /** get and set for customer ID and cannot be changed */
  set customerId(val) {
    if (this._customerId && this._customerId !== val) {
      throw new Error("Cannot change Customer ID");
    }
    this._customerId = val;
  }

  get customerId() {
    return this._customerId;
  }
}

module.exports = Reservation;
