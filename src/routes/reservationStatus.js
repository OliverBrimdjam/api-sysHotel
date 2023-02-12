const express = require('express');
const router = express.Router();
const ReservationStatus = require('../model/reservationStatus');
require('../relationships/reservationStatus');
const Reservation = require('../model/reservation');
require('../relationships/reservation');

/**
 *  @swagger
 *  components:
 *      schemas:
 *          ReservationStatus:
 *              type: object
 *              required:
 *                  - name
 *              properties:
 *                  id:
 *                      type: number
 *                      description: The auto-generated id of the ReservationStatus
 *                  name:
 *                      type: string
 *                      description: name of the ReservationStatus
 *                  createdAt:
 *                      type: date
 *                      description: auto-generated creation date
 *                  updatedAt:
 *                      type: date
 *                      description: auto-generated last update date
 *              example:
 *                  id: 1
 *                  name: "Reserved"
 *                  createdAt: "2023-02-10T03:57:43.274Z"
 *                  updatedAt: "2023-02-10T03:57:43.274Z"
 */

/**
 *  @swagger
 *  tags:
 *      name: ReservationStatus
 *      description: The ReservationStatuss managing API
 */

/** 
 *  @swagger
 *  /reservationStatus:
 *      get:
 *          summary: Returns the list of all reservationStatuss
 *          tags: [ReservationStatus]
 *          responses:
 *              200:
 *                  description: The list of reservationStatuss
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/ReservationStatus'
*/
router.get('/', async (req, res) => {
    try {
        const reservationStatuss = await ReservationStatus.findAll();
        res.status(200).json(reservationStatuss);
    } catch (error) {
        res.status(500).send(error);
    }

});

/** 
 *  @swagger
 *  /reservationStatus/{id}:
 *      get:
 *          summary: Returns the reservationStatus of the specified id
 *          tags: [ReservationStatus]
 *          parameters:
 *            - in: path
 *              name: id
 *              schema:
 *                  type: number
 *              required: true
 *              description: The reservationStatus id
 *          responses:
 *              200:
 *                  description: The reservationStatus
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/ReservationStatus'
 *              404:
 *                  decription: The reservationStatus is not found
 *              500:
 *                  decription: Unexpected error
*/
router.get('/:index', async (req, res) => {
    try {
        const { index } = req.params;
        const reservationStatus = await ReservationStatus.findOne({
            where: {
                id: index
            }
        });

        if (reservationStatus) {
            res.status(200).json(reservationStatus);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

/**
 *  @swagger
 *  /reservationStatus:
 *      post:
 *          summary: Create a new ReservationStatus
 *          tags: [ReservationStatus]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ReservationStatus'
 *          responses:
 *              201:
 *                  description: The reservationStatus is sucessfully created
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/ReservationStatus'
 *              500:
 *                  decription: Unexpected error
 */
router.post('/', async (req, res) => {
    try {
        const reservationStatus = req.body;
        delete reservationStatus.id;
        res.status(201).json(await ReservationStatus.create(reservationStatus));
    } catch (error) {
        res.status(500).send(error);
    }
});

/** 
 *  @swagger
 *  /reservationStatus:
 *      put:
 *          summary: Update the reservationStatus of the specified id
 *          tags: [ReservationStatus]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ReservationStatus'
 *          responses:
 *              200:
 *                  description: The reservationStatus was updated
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/ReservationStatus'
 *              404:
 *                  decription: The reservationStatus is not found
 *              500:
 *                  decription: Unexpected error
*/
router.put('/', async (req, res) => {
    try {
        const reservationStatus = req.body;
        const id = reservationStatus.id;
        const reservationStatusOld = await ReservationStatus.findOne({
            where: {
                id: id
            }
        });
        if (reservationStatusOld) {
            delete reservationStatus.id;
            const result = await ReservationStatus.update(
                reservationStatus,
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
 *  /reservationStatus/{id}:
 *      delete:
 *          summary: Delete the reservationStatus of the specified id
 *          tags: [ReservationStatus]
 *          parameters:
 *            - in: path
 *              name: id
 *              schema:
 *                  type: number
 *              required: true
 *              description: The reservationStatus id
 *          responses:
 *              200:
 *                  description: The reservationStatus was deleted
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/ReservationStatus'
 *              404:
 *                  decription: The reservationStatus is not found
 *              500:
 *                  decription: Unexpected error
*/
router.delete('/:index', async (req, res) => {
    try {
        const { index } = req.params;
        const reservationStatus = await ReservationStatus.findOne({
            where: {
                id: index
            }
        });
        if (reservationStatus) {
            const relationShip = await Reservation.findOne({
                where: {
                    reservationStatusId: index
                }
            });
            if (relationShip) {
                res.status(403).send({
                    errors: {
                        message: "This data cannot be deleted, has references to other elements"
                    }
                });
            } else {
                ReservationStatus.destroy({ where: { id: index } });
                res.status(202).json(reservationStatus);
            }
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;