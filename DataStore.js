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

  addBroker (todo) {
    // merge the existing brokers with the new todo
    this.brokers = [ ...this.brokers, todo ]

    return this.saveBrokers()
  }

  deleteBroker (todo) {
    // filter out the target todo
    this.brokers = this.brokers.filter(t => t !== todo)

    return this.saveBrokers()
  }
}

module.exports = DataStore
