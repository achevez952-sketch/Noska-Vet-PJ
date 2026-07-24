const express = require('express');
const mongoose = require('mongoose');

const AdoptionSchema = new mongoose.Schema({
  puppyId: { type: String, required: true },
  puppyName: { type: String, required: true },
  applicantName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  homeType: { type: String, required: true },
  date: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Adoption', AdoptionSchema);
