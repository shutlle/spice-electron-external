'use strict'

const Store = require('electron-store')

class DataStore extends Store {
  constructor (settings) {
    super(settings)

    // initialize with brokers or empty array
    this.brokers = this.get('brokers') || []
  }

  saveBrokers () {
    // save brokers to JSON file
    this.set('brokers', this.brokers)

    // returning 'this' allows method chaining
    return this
  }

  getBrokers () {
    // set object's brokers to brokers in JSON file
    this.brokers = this.get('brokers') || []

    return this
  }

  addBroker (broker) {
    // merge the existing brokers with the new broker
    this.brokers = [ ...this.brokers, broker ]

    return this.saveBrokers()
  }

  deleteBroker (broker) {
    // filter out the target broker
    this.brokers = this.brokers.filter(t => t.id !== broker)

    return this.saveBrokers()
  }
  getBroker (broker) {
    // get once object broker
    this.brokers_once = this.brokers.filter(t => t.id == broker)

    return this
  }

}

module.exports = DataStore
