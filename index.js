const express = require("express");
const app = express();
const bodyParser = require("body-parser");
var port=7000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create local variables to store data
let rooms = [];
let bookings = [];

// Create a new room with the following details: number of seats, amenities, and price
app.post("/rooms", (req, res) => {
  const room = {
    id: rooms.length + 1,
    seats: req.body.seats,
    amenities: req.body.amenities,
    price: req.body.price,
  };
  rooms.push(room);
  res.send(`Room ${room.id} created successfully!`);
});

// Book a room with the following details: customer name, date, start time, end time, and room ID
app.post("/bookings", (req, res) => {
  const roomId = req.body.roomId;
  const existingBooking = bookings.find(
    (booking) => booking.roomId === roomId && booking.status === "booked"
  );
  if (existingBooking) {
    res
      .status(400)
      .send(
        `Room ${roomId} is already booked at ${existingBooking.date} from ${existingBooking.startTime} to ${existingBooking.endTime} by ${existingBooking.customerName}.`
      );
  } else {
    const booking = {
      id: bookings.length + 1,
      customerName: req.body.customerName,
      date: req.body.date,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      roomId: roomId,
      status: "booked",
    };
    bookings.push(booking);
    res.send(
      `Room ${booking.roomId} booked successfully by ${booking.customerName}!`
    );
  }
});

// List all rooms with booked data, including the room name, booked status, customer name, date, start time, and end time
app.get("/rooms", (req, res) => {
  const data = [];
  for (const room of rooms) {
    const roomData = {
      roomName: `Room ${room.id}`,
      bookedStatus: "available",
      customerName: "",
      date: "",
      startTime: "",
      endTime: "",
    };
    for (const booking of bookings) {
      if (booking.roomId === room.id) {
        roomData.bookedStatus = booking.status;
        roomData.customerName = booking.customerName;
        roomData.date = booking.date;
        roomData.startTime = booking.startTime;
        roomData.endTime = booking.endTime;
      }
    }
    data.push(roomData);
  }
  res.send(data);
});

// List all customers with booked data, including the customer name, room name, date, start time, and end time
app.get("/customers", (req, res) => {
  const data = [];
  for (const booking of bookings) {
    const customerData = {
      customerName: booking.customerName,
      roomName: `Room ${booking.roomId}`,
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
    };
    data.push(customerData);
  }
  res.send(data);
});

// List how many times a customer has booked the room with the following details: Customer name, room name, date, start time, end time, booking ID, booking date, and booking status
app.get("/bookings/:customerName", (req, res) => {
  const customerName = req.params.customerName;
  const data = bookings
    .filter((booking) => booking.customerName === customerName)
    .map((booking) => ({
      customerName: booking.customerName,
      roomName: `Room ${booking.roomId}`,
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
      bookingId: booking.id,
      bookingDate: booking.date,
      bookingStatus: booking.status,
    }));
  console.log(bookings);
  res.send(data);
});

// Start the server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
