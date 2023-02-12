const express = require('express');
const router = express.Router();
const RoomHistory = require('../model/roomHistory');
require('../relationships/roomHistory');


/**
 *  @swagger
 *  components:
 *      schemas:
 *          RoomHistory:
 *              type: object
 *              required:
 *                  - name
 *                  - roomStatusId
 *                  - roomType
 *              properties:
 *                  id:
 *                      type: number
 *                      description: The auto-generated id of the RoomHistory
 *                  roomStatusId:
 *                      type: number
 *                      description: id of roomStatus
 *                  roomId:
 *                      type: number
 *                      description: id of room
 *                  lastChange:
 *                      type: date
 *                      description: log creation date 
 *              example:
 *                  id: 1
 *                  roomStatusId: 1
 *                  roomId: 1
 *                  lastChange: "2023-02-10T03:57:43.274Z"
 */

/**
 *  @swagger
 *  tags:
 *      name: RoomHistory
 *      description: The Rooms managing API
 */

/** 
 *  @swagger
 *  /roomHistory:
 *      get:
 *          summary: Returns the list of all rooms
 *          tags: [RoomHistory]
 *          responses:
 *              200:
 *                  description: The list of rooms
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/RoomHistory'
*/
router.get('/', async (req, res) => {
    try {
        const roomHistories = await RoomHistory.findAll();
        res.status(200).json(roomHistories);
    } catch (error) {
        res.status(500).send(error);
    }

});

/** 
 *  @swagger
 *  /roomHistory/room/{id}:
 *      get:
 *          summary: Returns the roomHistory of the specified id
 *          tags: [RoomHistory]
 *          parameters:
 *            - in: path
 *              name: id
 *              schema:
 *                  type: number
 *              required: true
 *              description: The roomHistory id
 *          responses:
 *              200:
 *                  description: The roomHistory
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/RoomHistory'
 *              404:
 *                  decription: The roomHistory is not found
 *              500:
 *                  decription: Unexpected error
*/
router.get('/room/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const roomHistory = await RoomHistory.findAll({
            where: {
                roomId: id
            }
        });

        if (roomHistory) {
            res.status(200).json(roomHistory);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        res.status(500).send(error);
    }

});



module.exports = router;