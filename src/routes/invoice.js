const express = require('express');
const router = express.Router();
const Invoice = require('../model/invoice');
require('../relationships/invoice');

/**
 *  @swagger
 *  components:
 *      schemas:
 *          Invoice:
 *              type: object
 *              required:
 *                  - guestId
 *                  - paidValue
 *                  - bill
 *              properties:
 *                  id:
 *                      type: number
 *                      description: The auto-generated id of the Invoice
 *                  guestId:
 *                      type: number
 *                      description: id of the guest
 *                  paidValue:
 *                      type: number
 *                      description: total paid by the guest
 *                  bill:
 *                      type: number
 *                      description: total guest bill
 *                  createdAt:
 *                      type: date
 *                      description: auto-generated creation date
 *                  updatedAt:
 *                      type: date
 *                      description: auto-generated last update date
 *              example:
 *                  id: 1
 *                  guestId: 1
 *                  paidValue: 0
 *                  bill: 2000
 *                  createdAt: "2023-02-10T03:57:43.274Z"
 *                  updatedAt: "2023-02-10T03:57:43.274Z"
 */

/**
 *  @swagger
 *  tags:
 *      name: Invoice
 *      description: The Invoices managing API
 */

/** 
 *  @swagger
 *  /invoice:
 *      get:
 *          summary: Returns the list of all invoices
 *          tags: [Invoice]
 *          responses:
 *              200:
 *                  description: The list of invoices
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/Invoice'
*/
router.get('/', async (req, res) => {
    try {
        const invoices = await Invoice.findAll();
        res.status(200).json(invoices);
    } catch (error) {
        res.status(500).send(error);
    }

});

/** 
 *  @swagger
 *  /invoice/{id}:
 *      get:
 *          summary: Returns the invoice of the specified id
 *          tags: [Invoice]
 *          parameters:
 *            - in: path
 *              name: id
 *              schema:
 *                  type: number
 *              required: true
 *              description: The invoice id
 *          responses:
 *              200:
 *                  description: The invoice
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Invoice'
 *              404:
 *                  decription: The invoice is not found
 *              500:
 *                  decription: Unexpected error
*/
router.get('/:index', async (req, res) => {
    try {
        const { index } = req.params;
        const invoice = await Invoice.findOne({
            where: {
                id: index
            }
        });

        if (invoice) {
            res.status(200).json(invoice);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

/**
 *  @swagger
 *  /invoice:
 *      post:
 *          summary: Create a new Invoice
 *          tags: [Invoice]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Invoice'
 *          responses:
 *              201:
 *                  description: The invoice is sucessfully created
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Invoice'
 *              500:
 *                  decription: Unexpected error
 */
router.post('/', async (req, res) => {
    try {
        const invoice = req.body;
        delete invoice.id;
        res.status(201).json(await Invoice.create(invoice));
    } catch (error) {
        res.status(500).send(error);
    }
});

/** 
 *  @swagger
 *  /invoice:
 *      put:
 *          summary: Update the invoice of the specified id
 *          tags: [Invoice]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Invoice'
 *          responses:
 *              200:
 *                  description: The invoice was updated
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Invoice'
 *              404:
 *                  decription: The invoice is not found
 *              500:
 *                  decription: Unexpected error
*/
router.put('/', async (req, res) => {
    try {
        const invoice = req.body;
        const id = invoice.id;
        const invoiceOld = await Invoice.findOne({
            where: {
                id: id
            }
        });
        if (invoiceOld) {
            delete invoice.id;
            const result = await Invoice.update(
                invoice,
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
 *  /invoice/{id}:
 *      delete:
 *          summary: Delete the invoice of the specified id
 *          tags: [Invoice]
 *          parameters:
 *            - in: path
 *              name: id
 *              schema:
 *                  type: number
 *              required: true
 *              description: The invoice id
 *          responses:
 *              200:
 *                  description: The invoice was deleted
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Invoice'
 *              404:
 *                  decription: The invoice is not found
 *              500:
 *                  decription: Unexpected error
*/
router.delete('/:index', async (req, res) => {
    try {
        const { index } = req.params;
        const invoice = await Invoice.findOne({
            where: {
                id: index
            }
        });
        if (invoice) {
            Invoice.destroy({ where: { id: index } });
            res.status(202).json(invoice);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;