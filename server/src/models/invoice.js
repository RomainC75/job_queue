const { Schema, model, SchemaTypes } = require("mongoose");

const invoiceSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    isDone: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
  }
);

const Invoice = model("possibleAdminEmail", invoiceSchema);

module.exports = Invoice;