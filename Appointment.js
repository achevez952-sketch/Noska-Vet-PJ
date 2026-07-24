const express = require('express');
const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  ownerName: { type: String, required: true },
  phone: { type: String, required: true },
  petName: { type: String, required: true },
  petType: { type: String, required: true },
  service: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', AppointmentSchema);
