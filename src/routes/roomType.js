const express = require('express');
const router = express.Router();
const RoomType = require('../model/roomType');
require('../relationships/roomType');
const Room = require('../model/room');
require('../relationships/room');

/**
 *  @swagger
 *  components:
 *      schemas:
 *          RoomType:
 *              type: object
 *              required:
 *                  - name
 *                  - price
 *              properties:
 *                  id:
 *                      type: number
 *                      description: The auto-generated id of the RoomType
 *                  name:
 *                      type: string
 *                      description: name of room type
 *                  price:
 *                      type: number
 *                      description: price of room type
 *                  createdAt:
 *                      type: date
 *                      description: auto-generated creation date
 *                  updatedAt:
 *                      type: date
 *                      description: auto-generated last update date
 *              example:
 *                  id: 1
 *                  name: "Single"
 *                  price: 1000
 *                  createdAt: "2023-02-10T03:57:43.274Z"
 *                  updatedAt: "2023-02-10T03:57:43.274Z"
 */

/**
 *  @swagger
 *  tags:
 *      name: RoomType
 *      description: The RoomTypes managing API
 */

/** 
 *  @swagger
 *  /roomType:
 *      get:
 *          summary: Returns the list of all roomTypes
 *          tags: [RoomType]
 *          responses:
 *              200:
 *                  description: The list of roomTypes
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/RoomType'
*/
router.get('/', async (req, res) => {
    try {
        const roomTypes = await RoomType.findAll();
        res.status(200).json(roomTypes);
    } catch (error) {
        res.status(500).send(error);
    }

});

/** 
 *  @swagger
 *  /roomType/{id}:
 *      get:
 *          summary: Returns the roomType of the specified id
 *          tags: [RoomType]
 *          parameters:
 *            - in: path
 *              name: id
 *              schema:
 *                  type: number
 *              required: true
 *              description: The roomType id
 *          responses:
 *              200:
 *                  description: The roomType
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/RoomType'
 *              404:
 *                  decription: The roomType is not found
 *              500:
 *                  decription: Unexpected error
*/
router.get('/:index', async (req, res) => {
    try {
        const { index } = req.params;
        const roomType = await RoomType.findOne({
            where: {
                id: index
            }
        });

        if (roomType) {
            res.status(200).json(roomType);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

/**
 *  @swagger
 *  /roomType:
 *      post:
 *          summary: Create a new RoomType
 *          tags: [RoomType]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/RoomType'
 *          responses:
 *              201:
 *                  description: The roomType is sucessfully created
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/RoomType'
 *              500:
 *                  decription: Unexpected error
 */
router.post('/', async (req, res) => {
    try {
        const roomType = req.body;
        delete roomType.id;
        res.status(201).json(await RoomType.create(roomType));
    } catch (error) {
        res.status(500).send(error);
    }
});

/** 
 *  @swagger
 *  /roomType:
 *      put:
 *          summary: Update the roomType of the specified id
 *          tags: [RoomType]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/RoomType'
 *          responses:
 *              200:
 *                  description: The roomType was updated
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/RoomType'
 *              404:
 *                  decription: The roomType is not found
 *              500:
 *                  decription: Unexpected error
*/
router.put('/', async (req, res) => {
    try {
        const roomType = req.body;
        const id = roomType.id;
        const roomTypeOld = await RoomType.findOne({
            where: {
                id: id
            }
        });
        if (roomTypeOld) {
            delete roomType.id;
            const result = await RoomType.update(
                roomType,
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
 *  /roomType/{id}:
 *      delete:
 *          summary: Delete the roomType of the specified id
 *          tags: [RoomType]
 *          parameters:
 *            - in: path
 *              name: id
 *              schema:
 *                  type: number
 *              required: true
 *              description: The roomType id
 *          responses:
 *              200:
 *                  description: The roomType was deleted
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/RoomType'
 *              404:
 *                  decription: The roomType is not found
 *              500:
 *                  decription: Unexpected error
*/
router.delete('/:index', async (req, res) => {
    try {
        const { index } = req.params;
        const roomType = await RoomType.findOne({
            where: {
                id: index
            }
        });
        if (roomType) {
            const relationShip = await Room.findOne({
                where: {
                    roomTypeId: index
                }
            });
            if (relationShip) {
                res.status(403).send({
                    errors: {
                        message: "This data cannot be deleted, has references to other elements"
                    }
                });
            } else {
                RoomType.destroy({ where: { id: index } });
                res.status(202).json(roomType);
            }
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;