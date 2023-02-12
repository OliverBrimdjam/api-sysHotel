const express = require('express');
const router = express.Router();
const RoomStatus = require('../model/roomStatus');
require('../relationships/roomStatus');
const Room = require('../model/room');
require('../relationships/room');

/**
 *  @swagger
 *  components:
 *      schemas:
 *          RoomStatus:
 *              type: object
 *              required:
 *                  - name
 *              properties:
 *                  id:
 *                      type: number
 *                      description: The auto-generated id of the RoomStatus
 *                  name:
 *                      type: string
 *                      description: name of status
 *                  createdAt:
 *                      type: date
 *                      description: auto-generated creation date
 *                  updatedAt:
 *                      type: date
 *                      description: auto-generated last update date
 *              example:
 *                  id: 1
 *                  name: "Available"
 *                  createdAt: "2023-02-10T03:57:43.274Z"
 *                  updatedAt: "2023-02-10T03:57:43.274Z"
 */

/**
 *  @swagger
 *  tags:
 *      name: RoomStatus
 *      description: The RoomStatuss managing API
 */

/** 
 *  @swagger
 *  /roomStatus:
 *      get:
 *          summary: Returns the list of all roomStatuss
 *          tags: [RoomStatus]
 *          responses:
 *              200:
 *                  description: The list of roomStatuss
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/RoomStatus'
*/
router.get('/', async (req, res) => {
    try {
        const roomStatuss = await RoomStatus.findAll();
        res.status(200).json(roomStatuss);
    } catch (error) {
        res.status(500).send(error);
    }

});

/** 
 *  @swagger
 *  /roomStatus/{id}:
 *      get:
 *          summary: Returns the roomStatus of the specified id
 *          tags: [RoomStatus]
 *          parameters:
 *            - in: path
 *              name: id
 *              schema:
 *                  type: number
 *              required: true
 *              description: The roomStatus id
 *          responses:
 *              200:
 *                  description: The roomStatus
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/RoomStatus'
 *              404:
 *                  decription: The roomStatus is not found
 *              500:
 *                  decription: Unexpected error
*/
router.get('/:index', async (req, res) => {
    try {
        const { index } = req.params;
        const roomStatus = await RoomStatus.findOne({
            where: {
                id: index
            }
        });

        if (roomStatus) {
            res.status(200).json(roomStatus);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

/**
 *  @swagger
 *  /roomStatus:
 *      post:
 *          summary: Create a new RoomStatus
 *          tags: [RoomStatus]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/RoomStatus'
 *          responses:
 *              201:
 *                  description: The roomStatus is sucessfully created
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/RoomStatus'
 *              500:
 *                  decription: Unexpected error
 */
router.post('/', async (req, res) => {
    try {
        const roomStatus = req.body;
        delete roomStatus.id;
        res.status(201).json(await RoomStatus.create(roomStatus));
    } catch (error) {
        res.status(500).send(error);
    }
});

/** 
 *  @swagger
 *  /roomStatus:
 *      put:
 *          summary: Update the roomStatus of the specified id
 *          tags: [RoomStatus]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/RoomStatus'
 *          responses:
 *              200:
 *                  description: The roomStatus was updated
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/RoomStatus'
 *              404:
 *                  decription: The roomStatus is not found
 *              500:
 *                  decription: Unexpected error
*/
router.put('/', async (req, res) => {
    try {
        const roomStatus = req.body;
        const id = roomStatus.id;
        const roomStatusOld = await RoomStatus.findOne({
            where: {
                id: id
            }
        });
        if (roomStatusOld) {
            delete roomStatus.id;
            const result = await RoomStatus.update(
                roomStatus,
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
 *  /roomStatus/{id}:
 *      delete:
 *          summary: Delete the roomStatus of the specified id
 *          tags: [RoomStatus]
 *          parameters:
 *            - in: path
 *              name: id
 *              schema:
 *                  type: number
 *              required: true
 *              description: The roomStatus id
 *          responses:
 *              200:
 *                  description: The roomStatus was deleted
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/RoomStatus'
 *              404:
 *                  decription: The roomStatus is not found
 *              500:
 *                  decription: Unexpected error
*/
router.delete('/:index', async (req, res) => {
    try {
        const { index } = req.params;
        const roomStatus = await RoomStatus.findOne({
            where: {
                id: index
            }
        });
        if (roomStatus) {
            const relationShip = await Room.findOne({
                where: {
                    roomStatusId: index
                }
            });
            if (relationShip) {
                res.status(403).send({
                    errors: {
                        message: "This data cannot be deleted, has references to other elements"
                    }
                });
            } else {
                RoomStatus.destroy({ where: { id: index } });
                res.status(202).json(roomStatus);
            }
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;