const express = require('express');
const router = express.Router();
const Room = require('../model/room');
require('../relationships/room');
const Reservation = require('../model/reservation');
require('../relationships/reservation');

/**
 *  @swagger
 *  components:
 *      schemas:
 *          Room:
 *              type: object
 *              required:
 *                  - name
 *                  - roomStatusId
 *                  - roomType
 *              properties:
 *                  id:
 *                      type: number
 *                      description: The auto-generated id of the Room
 *                  name:
 *                      type: string
 *                      description: name of the Room
 *                  roomStatusId:
 *                      type: number
 *                      description: id of roomStatus
 *                  roomTypeId:
 *                      type: number
 *                      description: id of roomType
 *                  createdAt:
 *                      type: date
 *                      description: auto-generated creation date
 *                  updatedAt:
 *                      type: date
 *                      description: auto-generated last update date
 *              example:
 *                  id: 1
 *                  name: "Suite Master 3"
 *                  roomStatusId: 1
 *                  roomTypeId: 1
 *                  createdAt: "2023-02-10T03:57:43.274Z"
 *                  updatedAt: "2023-02-10T03:57:43.274Z"
 */

/**
 *  @swagger
 *  tags:
 *      name: Room
 *      description: The Rooms managing API
 */

/** 
 *  @swagger
 *  /room:
 *      get:
 *          summary: Returns the list of all rooms
 *          tags: [Room]
 *          responses:
 *              200:
 *                  description: The list of rooms
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/Room'
*/
router.get('/', async (req, res) => {
    try {
        const rooms = await Room.findAll();
        res.status(200).json(rooms);
    } catch (error) {
        res.status(500).send(error);
    }

});

/** 
 *  @swagger
 *  /room/{id}:
 *      get:
 *          summary: Returns the room of the specified id
 *          tags: [Room]
 *          parameters:
 *            - in: path
 *              name: id
 *              schema:
 *                  type: number
 *              required: true
 *              description: The room id
 *          responses:
 *              200:
 *                  description: The room
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Room'
 *              404:
 *                  decription: The room is not found
 *              500:
 *                  decription: Unexpected error
*/
router.get('/:index', async (req, res) => {
    try {
        const { index } = req.params;
        const room = await Room.findOne({
            where: {
                id: index
            }
        });

        if (room) {
            res.status(200).json(room);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

/**
 *  @swagger
 *  /room:
 *      post:
 *          summary: Create a new Room
 *          tags: [Room]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Room'
 *          responses:
 *              201:
 *                  description: The room is sucessfully created
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Room'
 *              500:
 *                  decription: Unexpected error
 */
router.post('/', async (req, res) => {
    try {
        const room = req.body;
        console.log('room do post', room);
        delete room.id;
        res.status(201).json(await Room.create(room));
    } catch (error) {
        res.status(500).send(error);
    }
});

/** 
 *  @swagger
 *  /room:
 *      put:
 *          summary: Update the room of the specified id
 *          tags: [Room]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Room'
 *          responses:
 *              200:
 *                  description: The room was updated
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Room'
 *              404:
 *                  decription: The room is not found
 *              500:
 *                  decription: Unexpected error
*/
router.put('/', async (req, res) => {
    try {
        const room = req.body;
        const id = room.id;
        const roomOld = await Room.findOne({
            where: {
                id: id
            }
        });
        if (roomOld) {
            delete room.id;
            console.log('room do put',room)
            const result = await Room.update(
                room,
                {
                    where: { id: id }
                }
            );
            res.status(204).json(result);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

/** 
 *  @swagger
 *  /room/{id}:
 *      delete:
 *          summary: Delete the room of the specified id
 *          tags: [Room]
 *          parameters:
 *            - in: path
 *              name: id
 *              schema:
 *                  type: number
 *              required: true
 *              description: The room id
 *          responses:
 *              200:
 *                  description: The room was deleted
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Room'
 *              404:
 *                  decription: The room is not found
 *              500:
 *                  decription: Unexpected error
*/
router.delete('/:index', async (req, res) => {
    try {
        const { index } = req.params;
        const room = await Room.findOne({
            where: {
                id: index
            }
        });
        if (room) {
            const relationShip = await Reservation.findOne({
                where: {
                    roomId: index
                }
            });
            if (relationShip) {
                res.status(403).send({
                    errors: {
                        message: "This data cannot be deleted, has references to other elements"
                    }
                });
            } else {
                Room.destroy({ where: { id: index } });
                res.status(202).json(room);
            }
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;