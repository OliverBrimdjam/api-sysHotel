const express = require('express');
const router = express.Router();
const RoomService = require('../model/roomService');
require('../relationships/roomService');
const RoomServiceOrder = require('../model/roomServiceOrder');
require('../relationships/roomServiceOrder');

/**
 *  @swagger
 *  components:
 *      schemas:
 *          RoomService:
 *              type: object
 *              required:
 *                  - name
 *                  - price
 *              properties:
 *                  id:
 *                      type: number
 *                      description: The auto-generated id of the RoomService
 *                  name:
 *                      type: string
 *                      description: name of the service
 *                  price:
 *                      type: number
 *                      description: total cost of the service
 *                  createdAt:
 *                      type: date
 *                      description: auto-generated creation date
 *                  updatedAt:
 *                      type: date
 *                      description: auto-generated last update date
 *              example:
 *                  id: 1
 *                  name: "beer"
 *                  price: 10
 *                  createdAt: "2023-02-10T03:57:43.274Z"
 *                  updatedAt: "2023-02-10T03:57:43.274Z"
 */

/**
 *  @swagger
 *  tags:
 *      name: RoomService
 *      description: The RoomServices managing API
 */

/** 
 *  @swagger
 *  /roomService:
 *      get:
 *          summary: Returns the list of all roomServices
 *          tags: [RoomService]
 *          responses:
 *              200:
 *                  description: The list of roomServices
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/RoomService'
*/
router.get('/', async (req, res) => {
    try {
        const roomServices = await RoomService.findAll();
        res.status(200).json(roomServices);
    } catch (error) {
        res.status(500).send(error);
    }

});

/** 
 *  @swagger
 *  /roomService/{id}:
 *      get:
 *          summary: Returns the roomService of the specified id
 *          tags: [RoomService]
 *          parameters:
 *            - in: path
 *              name: id
 *              schema:
 *                  type: number
 *              required: true
 *              description: The roomService id
 *          responses:
 *              200:
 *                  description: The roomService
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/RoomService'
 *              404:
 *                  decription: The roomService is not found
 *              500:
 *                  decription: Unexpected error
*/
router.get('/:index', async (req, res) => {
    try {
        const { index } = req.params;
        const roomService = await RoomService.findOne({
            where: {
                id: index
            }
        });

        if (roomService) {
            res.status(200).json(roomService);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

/**
 *  @swagger
 *  /roomService:
 *      post:
 *          summary: Create a new RoomService
 *          tags: [RoomService]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/RoomService'
 *          responses:
 *              201:
 *                  description: The roomService is sucessfully created
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/RoomService'
 *              500:
 *                  decription: Unexpected error
 */
router.post('/', async (req, res) => {
    try {
        const roomService = req.body;
        delete roomService.id;
        res.status(201).json(await RoomService.create(roomService));
    } catch (error) {
        res.status(500).send(error);
    }
});

/** 
 *  @swagger
 *  /roomService:
 *      put:
 *          summary: Update the roomService of the specified id
 *          tags: [RoomService]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/RoomService'
 *          responses:
 *              200:
 *                  description: The roomService was updated
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/RoomService'
 *              404:
 *                  decription: The roomService is not found
 *              500:
 *                  decription: Unexpected error
*/
router.put('/', async (req, res) => {
    try {
        const roomService = req.body;
        const id = roomService.id;
        const roomServiceOld = await RoomService.findOne({
            where: {
                id: id
            }
        });
        if (roomServiceOld) {
            delete roomService.id;
            const result = await RoomService.update(
                roomService,
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
 *  /roomService/{id}:
 *      delete:
 *          summary: Delete the roomService of the specified id
 *          tags: [RoomService]
 *          parameters:
 *            - in: path
 *              name: id
 *              schema:
 *                  type: number
 *              required: true
 *              description: The roomService id
 *          responses:
 *              200:
 *                  description: The roomService was deleted
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/RoomService'
 *              404:
 *                  decription: The roomService is not found
 *              500:
 *                  decription: Unexpected error
*/
router.delete('/:index', async (req, res) => {
    try {
        const { index } = req.params;
        const roomService = await RoomService.findOne({
            where: {
                id: index
            }
        });
        if (roomService) {
            const relationShip = await RoomServiceOrder.findOne({
                where: {
                    roomServiceId: index
                }
            });
            if (relationShip) {
                res.status(403).send({
                    errors: {
                        message: "This data cannot be deleted, has references to other elements"
                    }
                });
            } else {
                RoomService.destroy({ where: { id: index } });
                res.status(202).json(roomService);
            }
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;