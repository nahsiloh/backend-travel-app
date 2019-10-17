const request = require("supertest");
const app = require("../app");
const Trip = require("../models/Trip");

const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

describe("/trips", () => {
  let mongoServer;
  beforeAll(async () => {
    try {
      mongoServer = new MongoMemoryServer();
      const mongoUri = await mongoServer.getConnectionString();
      await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
      });
    } catch (err) {
      console.error(err);
    }
  });

  beforeEach(async () => {
    await Trip.create([
      {
        itinerary: [
          {
            program: "Attraction",
            destination: "Zoo",
            date: "2019-10-14T16:00:00.000Z"
          }
        ]
      }
    ]);
  });

  afterEach(async () => {
    await Trip.deleteMany();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  describe("[GET]/trips", () => {
    it("/:id should return one trip by id", async () => {
      const expectedTrip = [
        {
          itinerary: [
            {
              program: "Attraction",
              destination: "Zoo",
              date: "2019-10-14T16:00:00.000Z"
            }
          ]
        }
      ];

      const { body: actualTrip } = await request(app)
        .get("/trips")
        .expect(200);

      const id = actualTrip[0]._id;
      await request(app)
        .get("/trips/" + id)
        .expect(200);

      expect(actualTrip[0].itinerary[0]).toEqual(
        expect.objectContaining(expectedTrip[0].itinerary[0])
      );
    });
  });

  describe("[POST]/trips", () => {
    it("/new should add one trip", async () => {
      const expectedTrip = [
        {
          itinerary: [
            {
              program: "Attraction",
              destination: "Zoo",
              date: "2019-10-14T16:00:00.000Z"
            }
          ]
        },
        {
          itinerary: [
            {
              program: "Accommodation",
              destination: "Fullerton",
              date: "2019-10-14T16:00:00.000Z"
            }
          ]
        }
      ];

      const addTrip = {
        itinerary: [
          {
            program: "Accommodation",
            destination: "Fullerton",
            date: "2019-10-14T16:00:00.000Z"
          }
        ]
      };

      await request(app)
        .post("/trips/new")
        .send(addTrip)
        .expect(200);

      const { body: actualTrip } = await request(app)
        .get("/trips")
        .expect(200);

      expect(actualTrip[0].itinerary[0]).toEqual(
        expect.objectContaining(expectedTrip[0].itinerary[0])
      );

      expect(actualTrip[1].itinerary[0]).toEqual(
        expect.objectContaining(expectedTrip[1].itinerary[0])
      );
    });
  });

  describe("[PATCH]/trips", () => {
    it("/:id should edit one trip by id", async () => {
      const expectedTrip = [
        {
          itinerary: [
            {
              program: "Accommodation",
              destination: "Fullerton",
              date: "2019-10-14T16:00:00.000Z"
            }
          ]
        }
      ];
      const updatedTrip = {
        itinerary: [
          {
            program: "Accommodation",
            destination: "Fullerton",
            date: "2019-10-14T16:00:00.000Z"
          }
        ]
      };

      const { body: originalTrip } = await request(app)
        .get("/trips")
        .expect(200);

      const id = originalTrip[0]._id;

      const { body: newTrip } = await request(app)
        .patch("/trips/" + id)
        .send(updatedTrip)
        .expect(200);

      expect(newTrip[0].itinerary[0]).toEqual(
        expect.objectContaining(expectedTrip[0].itinerary[0])
      );
    });
  });

  describe("[DELETE]/trips", () => {
    it("/:id should delete one trip by id", async () => {
      const { body: originalTrip } = await request(app)
        .get("/trips")
        .expect(200);

      const id = originalTrip[0]._id;

      const { body: deleteTrip } = await request(app)
        .delete("/trips/" + id)
        .expect(200);

      expect(deleteTrip.length).toBe(0);
    });
  });
});
