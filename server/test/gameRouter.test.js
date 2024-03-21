const routerFunction = require("../modules/gameRouterFunctions");
const uuid = require("uuid");
const Room = require("../modules/Room");
const Game = require("../modules/Game");
jest.mock("uuid");

function mockResponse() {
  let res = {};
  res.json = jest.fn();
  res.status = jest.fn(() => res); // chained
  return res;
}
describe("/join route. Player initial call to route", () => {
  test("returns roomID ", () => {
    let req = {
      headers: {
        origin: "localhost",
      },
    };
    const res = mockResponse();
    let rooms = [];
    jest
      .spyOn(uuid, "v4")
      .mockReturnValue("d6d0b7fb-3bae-4fec-ac0d-0fbd264b1436");
    routerFunction.join(req, res, rooms);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      roomID: "d6d0b7fb-3bae-4fec-ac0d-0fbd264b1436",
    });
  });
});
describe("/join route. Player already in the room", () => {
  test("returns roomID and message", () => {
    let req = {
      headers: {
        origin: "localhost",
      },
    };
    const res = mockResponse();
    let rooms = [];
    let room = new Room("d6d0b7fb-3bae-4fec-ac0d-0fbd264b1436");
    (room.playersInRoom = [{ player: "localhost", status: "Not Ready" }]),
      rooms.push(room);
    // jest.spyOn(uuid, 'v4').mockReturnValue("d6d0b7fb-3bae-4fec-ac0d-0fbd264b1436")
    routerFunction.join(req, res, rooms);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Player already in a room",
      roomID: "d6d0b7fb-3bae-4fec-ac0d-0fbd264b1436",
    });
  });
});
describe("/Ready route. Player not in the room", () => {
  test("returns 401 and message", () => {
    let req = {
      headers: {
        origin: "localhost",
      },
    };
    const res = mockResponse();
    let rooms = [];
    routerFunction.ready(req, res, rooms);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Player not in a room",
    });
  });
});
describe("/Ready route. Player in the room, waiting on all players", () => {
  test("returns 200 and message", () => {
    let req = {
      headers: {
        origin: "localhost",
      },
    };
    const res = mockResponse();
    let rooms = [];
    let room = new Room("d6d0b7fb-3bae-4fec-ac0d-0fbd264b1436");
    room.playersInRoom = [{ player: "localhost", status: "Not Ready" }]
    room.numPlayers = 1
      rooms.push(room);   
    routerFunction.ready(req, res, rooms);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Request taken in account, waiting for other player",
    });
  });
});
describe("/Ready route. Both Players are ready", () => {
    test("returns 200 and message", () => {
      let req = {
        headers: {
          origin: "localhost",
        },
      };
      const res = mockResponse();
      let rooms = [];
      let room = new Room("d6d0b7fb-3bae-4fec-ac0d-0fbd264b1436");
      room.playersInRoom = [{ player: "localhost", status: "Not Ready" }, { player: "localhost2", status: "Ready" }]
      room.numPlayers = 2
        rooms.push(room);   
      routerFunction.ready(req, res, rooms);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Game Started!",
      });
    });
  });
  describe("/Ready route. Game already started", () => {
    test("returns 200 and message", () => {
      let req = {
        headers: {
          origin: "localhost",
        },
      };
      const res = mockResponse();
      let rooms = [];
      let room = new Room("d6d0b7fb-3bae-4fec-ac0d-0fbd264b1436");
      room.playersInRoom = [{ player: "localhost", status: "Ready" }, { player: "localhost2", status: "Ready" }]
      room.numPlayers = 2
      room.game = new Game()
        rooms.push(room);   
      routerFunction.ready(req, res, rooms);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Game already started",
      });
    });
  });
