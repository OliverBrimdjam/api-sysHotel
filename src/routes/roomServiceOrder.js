const express = require('express');
const router = express.Router();
const RoomServiceOrder = require('../model/roomServiceOrder');
require('../relationships/roomServiceOrder');

/**
 *  @swagger
 *  components:
 *      schemas:
 *          RoomServiceOrder:
 *              type: object
 *              required:
 *                  - reservationId
 *                  - roomServiceId
 *                  - roomServiceStatusId
 *              properties:
 *                  id:
 *                      type: number
 *                      description: The auto-generated id of the RoomServiceOrder
 *                  reservationId:
 *                      type: number
 *                      description: id of the reservation
 *                  roomServiceId:
 *                      type: number
 *                      description: id of the roomService
 *                  roomServiceStatusId:
 *                      type: number
 *                      description: id of the roomServiceStatus
 *                  createdAt:
 *                      type: date
 *                      description: auto-generated creation date
 *                  updatedAt:
 *                      type: date
 *                      description: auto-generated last update date
 *              example:
 *                  id: 1
 *                  reservationId: 1
 *                  roomServiceId: 1
 *                  roomServiceStatusId: 1
 *                  createdAt: "2023-02-10T03:57:43.274Z"
 *                  updatedAt: "2023-02-10T03:57:43.274Z"
 */

/**
 *  @swagger
 *  tags:
 *      name: RoomServiceOrder
 *      description: The RoomServiceOrders managing API
 */

/** 
 *  @swagger
 *  /roomServiceOrder:
 *      get:
 *          summary: Returns the list of all roomServiceOrders
 *          tags: [RoomServiceOrder]
 *          responses:
 *              200:
 *                  description: The list of roomServiceOrders
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/RoomServiceOrder'
*/
router.get('/', async (req, res) => {
    try {
        const roomServiceOrders = await RoomServiceOrder.findAll();
        res.status(200).json(roomServiceOrders);
    } catch (error) {
        res.status(500).send(error);
    }

});

/** 
 *  @swagger
 *  /roomServiceOrder/{id}:
 *      get:
 *          summary: Returns the roomServiceOrder of the specified id
 *          tags: [RoomServiceOrder]
 *          parameters:
 *            - in: path
 *              name: id
 *              schema:
 *                  type: number
 *              required: true
 *              description: The roomServiceOrder id
 *          responses:
 *              200:
 *                  description: The roomServiceOrder
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/RoomServiceOrder'
 *              404:
 *                  decription: The roomServiceOrder is not found
 *              500:
 *                  decription: Unexpected error
*/
router.get('/:index', async (req, res) => {
    try {
        const { index } = req.params;
        const roomServiceOrder = await RoomServiceOrder.findOne({
            where: {
                id: index
            }
        });

        if (roomServiceOrder) {
            res.status(200).json(roomServiceOrder);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

/**
 *  @swagger
 *  /roomServiceOrder:
 *      post:
 *          summary: Create a new RoomServiceOrder
 *          tags: [RoomServiceOrder]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/RoomServiceOrder'
 *          responses:
 *              201:
 *                  description: The roomServiceOrder is sucessfully created
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/RoomServiceOrder'
 *              500:
 *                  decription: Unexpected error
 */
router.post('/', async (req, res) => {
    try {
        const roomServiceOrder = req.body;
        delete roomServiceOrder.id;
        res.status(201).json(await RoomServiceOrder.create(roomServiceOrder));
    } catch (error) {
        res.status(500).send(error);
    }
});

/** 
 *  @swagger
 *  /roomServiceOrder:
 *      put:
 *          summary: Update the roomServiceOrder of the specified id
 *          tags: [RoomServiceOrder]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/RoomServiceOrder'
 *          responses:
 *              200:
 *                  description: The roomServiceOrder was updated
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/RoomServiceOrder'
 *              404:
 *                  decription: The roomServiceOrder is not found
 *              500:
 *                  decription: Unexpected error
*/
router.put('/', async (req, res) => {
    try {
        const roomServiceOrder = req.body;
        const id = roomServiceOrder.id;
        const roomServiceOrderOld = await RoomServiceOrder.findOne({
            where: {
                id: id
            }
        });
        if (roomServiceOrderOld) {
            delete roomServiceOrder.id;
            const result = await RoomServiceOrder.update(
                roomServiceOrder,
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
 *  /roomServiceOrder/{id}:
 *      delete:
 *          summary: Delete the roomServiceOrder of the specified id
 *          tags: [RoomServiceOrder]
 *          parameters:
 *            - in: path
 *              name: id
 *              schema:
 *                  type: number
 *              required: true
 *              description: The roomServiceOrder id
 *          responses:
 *              200:
 *                  description: The roomServiceOrder was deleted
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/RoomServiceOrder'
 *              404:
 *                  decription: The roomServiceOrder is not found
 *              500:
 *                  decription: Unexpected error
*/
router.delete('/:index', async (req, res) => {
    try {
        const { index } = req.params;
        const roomServiceOrder = await RoomServiceOrder.findOne({
            where: {
                id: index
            }
        });
        if (roomServiceOrder) {
            RoomServiceOrder.destroy({ where: { id: index } });
            res.status(202).json(roomServiceOrder);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;