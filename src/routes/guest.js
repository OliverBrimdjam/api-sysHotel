const express = require('express');
const router = express.Router();
const Guest = require('../model/guest');
require('../relationships/guest');
const Reservation = require('../model/reservation');
require('../relationships/reservation');
const Invoice = require('../model/invoice');
require('../relationships/invoice');
const Op = require('Sequelize').Op;


/**
 *  @swagger
 *  components:
 *      schemas:
 *          Guest:
 *              type: object
 *              required:
 *                  - name
 *                  - email
 *                  - phone
 *                  - documentType
 *                  - documentCode
 *              properties:
 *                  id:
 *                      type: number
 *                      description: The auto-generated id of the Guest
 *                  name:
 *                      type: string
 *                      description: complete name of the Guest
 *                  email:
 *                      type: string
 *                      description: email of the Guest
 *                  phone:
 *                      type: string
 *                      description: phone number of the Guest
 *                  documentType:
 *                      type: string
 *                      description: name of document for identify the Guest
 *                  documentCode:
 *                      type: string
 *                      description: unique code of document for identify the Guest
 *                  createdAt:
 *                      type: date
 *                      description: auto-generated creation date
 *                  updatedAt:
 *                      type: date
 *                      description: auto-generated last update date
 *              example:
 *                  id: 1
 *                  name: "Rodrigo"
 *                  email: "rodrigoTeste999@gmail.com"
 *                  phone: "00 99 99112 1245"
 *                  documentType: "RG"
 *                  documentCode: "218442"
 *                  createdAt: "2023-02-10T03:57:43.274Z"
 *                  updatedAt: "2023-02-10T03:57:43.274Z"
 */

/**
 *  @swagger
 *  tags:
 *      name: Guest
 *      description: The Guests managing API
 */

/** 
 *  @swagger
 *  /guest:
 *      get:
 *          summary: Returns the list of all guests
 *          tags: [Guest]
 *          responses:
 *              200:
 *                  description: The list of guests
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/Guest'
*/
router.get('/', async (req, res) => {
    try {
        const guests = await Guest.findAll();
        res.status(200).json(guests);
    } catch (error) {
        res.status(500).send(error);
    }

});

/** 
 *  @swagger
 *  /guest/{id}:
 *      get:
 *          summary: Returns the guest of the specified id
 *          tags: [Guest]
 *          parameters:
 *            - in: path
 *              name: id
 *              schema:
 *                  type: number
 *              required: true
 *              description: The guest id
 *          responses:
 *              200:
 *                  description: The guest
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Guest'
 *              404:
 *                  decription: The guest is not found
 *              500:
 *                  decription: Unexpected error
*/
router.get('/:index', async (req, res) => {
    try {
        const { index } = req.params;
        const guest = await Guest.findOne({
            where: {
                id: index
            }
        });

        if (guest) {
            res.status(200).json(guest);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

/**
 *  @swagger
 *  /guest:
 *      post:
 *          summary: Create a new Guest
 *          tags: [Guest]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Guest'
 *          responses:
 *              201:
 *                  description: The guest is sucessfully created
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Guest'
 *              500:
 *                  decription: Unexpected error
 */
router.post('/', async (req, res) => {
    try {
        const guest = req.body;
        delete guest.id;
        res.status(201).json(await Guest.create(guest));
    } catch (error) {
        res.status(500).send(error);
    }
});

/** 
 *  @swagger
 *  /guest:
 *      put:
 *          summary: Update the guest of the specified id
 *          tags: [Guest]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Guest'
 *          responses:
 *              200:
 *                  description: The guest was updated
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Guest'
 *              404:
 *                  decription: The guest is not found
 *              500:
 *                  decription: Unexpected error
*/
router.put('/', async (req, res) => {
    try {
        const guest = req.body;
        const id = guest.id;
        const guestOld = await Guest.findOne({
            where: {
                id: id
            }
        });
        if (guestOld) {
            delete guest.id;
            const result = await Guest.update(
                guest,
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
 *  /guest/{id}:
 *      delete:
 *          summary: Delete the guest of the specified id
 *          tags: [Guest]
 *          parameters:
 *            - in: path
 *              name: id
 *              schema:
 *                  type: number
 *              required: true
 *              description: The guest id
 *          responses:
 *              200:
 *                  description: The guest was deleted
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Guest'
 *              404:
 *                  decription: The guest is not found
 *              500:
 *                  decription: Unexpected error
*/
router.delete('/:index', async (req, res) => {
    try {
        const { index } = req.params;
        const guest = await Guest.findOne({
            where: {
                id: index
            }
        });
        if (guest) {
            const relationShip = await Reservation.findOne({
                where: {
                    [Op.or]: [{ guestId: index }, { companionId: index }]
                }
            });
            if (!relationShip) {
                const checkInvoice = await Invoice.findOne({
                    where: {
                        guestId: index
                    }
                });
                if (!checkInvoice) {
                    Guest.destroy({ where: { id: index } });
                    res.status(202).json(guest);
                    return;
                }
            }
            res.status(403).send({
                errors: {
                    message: "This data cannot be deleted, has references to other elements"
                }
            });

        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;