class Supplier {
  constructor({ id, name, contactPerson, phone, email, location, products }) {
    this.id = id;
    this.name = name;
    this.contactPerson = contactPerson;
    this.phone = phone;
    this.email = email;
    this.location = location;
    this.products = products;
  }
}

module.exports = Supplier;
