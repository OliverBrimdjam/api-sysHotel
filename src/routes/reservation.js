const express = require('express');
const router = express.Router();
const Reservation = require('../model/reservation');
require('../relationships/reservation');
const RoomServiceOrder = require('../model/roomServiceOrder');
require('../relationships/roomServiceOrder');

/**
 *  @swagger
 *  components:
 *      schemas:
 *          Reservation:
 *              type: object
 *              required:
 *                  - roomId
 *                  - guestId
 *                  - reservationStatusId
 *                  - reserveStart
 *                  - days
 *              properties:
 *                  id:
 *                      type: number
 *                      description: The auto-generated id of the Reservation
 *                  roomId:
 *                      type: number
 *                      description: id of room
 *                  guestId:
 *                      type: number
 *                      description: id of guest
 *                  companionId:
 *                      type: number
 *                      description: id of companion
 *                  reservationStatusId:
 *                      type: number
 *                      description: id of reservationStatus
 *                  reserveStart:
 *                      type: date
 *                      description: booking date of guest
 *                  days:
 *                      type: number
 *                      description: number of days of booking
 *                  checkIn:
 *                      type: date
 *                      description: date the guest arrived at the hotel
 *                  checkOut:
 *                      type: date
 *                      description: date the guest left the hotel
 *                  createdAt:
 *                      type: date
 *                      description: auto-generated creation date
 *                  updatedAt:
 *                      type: date
 *                      description: auto-generated last update date
 *              example:
 *                  id: 1
 *                  roomId: 1
 *                  guestId: 1
 *                  companionId: null
 *                  reservationStatusId: 1
 *                  reserveStart: "2023-06-10T03:57:43.274Z"
 *                  days: 10
 *                  checkIn: null
 *                  checkOut: null
 *                  createdAt: "2023-02-10T03:57:43.274Z"
 *                  updatedAt: "2023-02-10T03:57:43.274Z"
 */

/**
 *  @swagger
 *  tags:
 *      name: Reservation
 *      description: The Reservations managing API
 */

/** 
 *  @swagger
 *  /reservation:
 *      get:
 *          summary: Returns the list of all reservations
 *          tags: [Reservation]
 *          responses:
 *              200:
 *                  description: The list of reservations
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/Reservation'
*/
router.get('/', async (req, res) => {
    try {
        const reservations = await Reservation.findAll();
        res.status(200).json(reservations);
    } catch (error) {
        res.status(500).send(error);
    }

});

/** 
 *  @swagger
 *  /reservation/{id}:
 *      get:
 *          summary: Returns the reservation of the specified id
 *          tags: [Reservation]
 *          parameters:
 *            - in: path
 *              name: id
 *              schema:
 *                  type: number
 *              required: true
 *              description: The reservation id
 *          responses:
 *              200:
 *                  description: The reservation
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Reservation'
 *              404:
 *                  decription: The reservation is not found
 *              500:
 *                  decription: Unexpected error
*/
router.get('/:index', async (req, res) => {
    try {
        const { index } = req.params;
        const reservation = await Reservation.findOne({
            where: {
                id: index
            }
        });

        if (reservation) {
            res.status(200).json(reservation);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

/**
 *  @swagger
 *  /reservation:
 *      post:
 *          summary: Create a new Reservation
 *          tags: [Reservation]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Reservation'
 *          responses:
 *              201:
 *                  description: The reservation is sucessfully created
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Reservation'
 *              500:
 *                  decription: Unexpected error
 */
router.post('/', async (req, res) => {
    try {
        const reservation = req.body;
        delete reservation.id;
        res.status(201).json(await Reservation.create(reservation));
    } catch (error) {
        res.status(500).send(error);
    }
});

/** 
 *  @swagger
 *  /reservation:
 *      put:
 *          summary: Update the reservation of the specified id
 *          tags: [Reservation]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Reservation'
 *          responses:
 *              200:
 *                  description: The reservation was updated
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Reservation'
 *              404:
 *                  decription: The reservation is not found
 *              500:
 *                  decription: Unexpected error
*/
router.put('/', async (req, res) => {
    try {
        const reservation = req.body;
        const id = reservation.id;
        const reservationOld = await Reservation.findOne({
            where: {
                id: id
            }
        });
        if (reservationOld) {
            delete reservation.id;
            const result = await Reservation.update(
                reservation,
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
 *  /reservation/{id}:
 *      delete:
 *          summary: Delete the reservation of the specified id
 *          tags: [Reservation]
 *          parameters:
 *            - in: path
 *              name: id
 *              schema:
 *                  type: number
 *              required: true
 *              description: The reservation id
 *          responses:
 *              200:
 *                  description: The reservation was deleted
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Reservation'
 *              404:
 *                  decription: The reservation is not found
 *              500:
 *                  decription: Unexpected error
*/
router.delete('/:index', async (req, res) => {
    try {
        const { index } = req.params;
        const reservation = await Reservation.findOne({
            where: {
                id: index
            }
        });
        if (reservation) {
            const relationShip = await RoomServiceOrder.findOne({
                where: {
                    reservationId: index
                }
            });
            if (relationShip) {
                res.status(403).send({
                    errors: {
                        message: "This data cannot be deleted, has references to other elements"
                    }
                });
            } else {
                Reservation.destroy({ where: { id: index } });
                res.status(202).json(reservation);
            }
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;