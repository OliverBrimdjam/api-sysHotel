const express = require('express');
const router = express.Router();
const RoomServiceStatus = require('../model/roomServiceStatus');
require('../relationships/roomServiceStatus');
const RoomServiceOrder = require('../model/roomServiceOrder');
require('../relationships/roomServiceOrder');

/**
 *  @swagger
 *  components:
 *      schemas:
 *          RoomServiceStatus:
 *              type: object
 *              required:
 *                  - name
 *              properties:
 *                  id:
 *                      type: number
 *                      description: The auto-generated id of the RoomServiceStatus
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
 *                  name: "Ordered"
 *                  createdAt: "2023-02-10T03:57:43.274Z"
 *                  updatedAt: "2023-02-10T03:57:43.274Z"
 */

/**
 *  @swagger
 *  tags:
 *      name: RoomServiceStatus
 *      description: The RoomServiceStatuss managing API
 */

/** 
 *  @swagger
 *  /roomServiceStatus:
 *      get:
 *          summary: Returns the list of all roomServiceStatuss
 *          tags: [RoomServiceStatus]
 *          responses:
 *              200:
 *                  description: The list of roomServiceStatuss
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/RoomServiceStatus'
*/
router.get('/', async (req, res) => {
    try {
        const roomServiceStatuss = await RoomServiceStatus.findAll();
        res.status(200).json(roomServiceStatuss);
    } catch (error) {
        res.status(500).send(error);
    }

});

/** 
 *  @swagger
 *  /roomServiceStatus/{id}:
 *      get:
 *          summary: Returns the roomServiceStatus of the specified id
 *          tags: [RoomServiceStatus]
 *          parameters:
 *            - in: path
 *              name: id
 *              schema:
 *                  type: number
 *              required: true
 *              description: The roomServiceStatus id
 *          responses:
 *              200:
 *                  description: The roomServiceStatus
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/RoomServiceStatus'
 *              404:
 *                  decription: The roomServiceStatus is not found
 *              500:
 *                  decription: Unexpected error
*/
router.get('/:index', async (req, res) => {
    try {
        const { index } = req.params;
        const roomServiceStatus = await RoomServiceStatus.findOne({
            where: {
                id: index
            }
        });

        if (roomServiceStatus) {
            res.status(200).json(roomServiceStatus);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

/**
 *  @swagger
 *  /roomServiceStatus:
 *      post:
 *          summary: Create a new RoomServiceStatus
 *          tags: [RoomServiceStatus]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/RoomServiceStatus'
 *          responses:
 *              201:
 *                  description: The roomServiceStatus is sucessfully created
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/RoomServiceStatus'
 *              500:
 *                  decription: Unexpected error
 */
router.post('/', async (req, res) => {
    try {
        const roomServiceStatus = req.body;
        delete roomServiceStatus.id;
        res.status(201).json(await RoomServiceStatus.create(roomServiceStatus));
    } catch (error) {
        res.status(500).send(error);
    }
});

/** 
 *  @swagger
 *  /roomServiceStatus:
 *      put:
 *          summary: Update the roomServiceStatus of the specified id
 *          tags: [RoomServiceStatus]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/RoomServiceStatus'
 *          responses:
 *              200:
 *                  description: The roomServiceStatus was updated
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/RoomServiceStatus'
 *              404:
 *                  decription: The roomServiceStatus is not found
 *              500:
 *                  decription: Unexpected error
*/
router.put('/', async (req, res) => {
    try {
        const roomServiceStatus = req.body;
        const id = roomServiceStatus.id;
        const roomServiceStatusOld = await RoomServiceStatus.findOne({
            where: {
                id: id
            }
        });
        if (roomServiceStatusOld) {
            delete roomServiceStatus.id;
            const result = await RoomServiceStatus.update(
                roomServiceStatus,
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
 *  /roomServiceStatus/{id}:
 *      delete:
 *          summary: Delete the roomServiceStatus of the specified id
 *          tags: [RoomServiceStatus]
 *          parameters:
 *            - in: path
 *              name: id
 *              schema:
 *                  type: number
 *              required: true
 *              description: The roomServiceStatus id
 *          responses:
 *              200:
 *                  description: The roomServiceStatus was deleted
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/RoomServiceStatus'
 *              404:
 *                  decription: The roomServiceStatus is not found
 *              500:
 *                  decription: Unexpected error
*/
router.delete('/:index', async (req, res) => {
    try {
        const { index } = req.params;
        const roomServiceStatus = await RoomServiceStatus.findOne({
            where: {
                id: index
            }
        });
        if (roomServiceStatus) {
            const relationShip = await RoomServiceOrder.findOne({
                where: {
                    roomServiceStatusId: index
                }
            });
            if (relationShip) {
                res.status(403).send({
                    errors: {
                        message: "This data cannot be deleted, has references to other elements"
                    }
                });
            } else {
                RoomServiceStatus.destroy({ where: { id: index } });
                res.status(202).json(roomServiceStatus);
            }
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;