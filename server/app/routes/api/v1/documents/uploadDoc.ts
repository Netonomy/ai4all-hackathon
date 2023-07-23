import { Router } from "express";
import { authenticateToken } from "../../../../middleware/auth.middleware.js";
import multer from "multer";
import { dwn } from "../../../../config/web5AndAgentExecutor.js";
const upload = multer({ storage: multer.memoryStorage() });

/**
 * @swagger
 * /api/v1/documents/uploadDoc:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 required: true
 *     responses:
 *       200:
 *         description: OK
 *     tags:
 *       - Documents
 */
export default Router({ mergeParams: true }).post(
  "/v1/documents/uploadDoc",
  authenticateToken,
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file)
        return res.status(400).json({
          message: "No file uploaded",
        });

      const blob = req.file.buffer;

      // Upload blob
      const blobResult = await dwn.records.create({
        data: blob,
        message: {
          dataFormat: req.file.mimetype,
        },
      });

      const data = {
        "@context": "https://schema.org",
        "@type": "DigitalDocument",
        name: req.file.originalname,
        encodingFormat: req.file.mimetype,
        size: req.file.size.toString(),
        datePublished: new Date().toISOString(),
        identifier: blobResult.record!.id,
        blobRecordId: blobResult.record!.id,
      };

      await dwn.records.create({
        data: data,
        message: {
          schema: "https://schema.org/DigitalDocument",
        },
      });

      res.json({
        message: "Uploaded file",
      });
    } catch (err: any) {
      console.error(err);
      res.status(400).json({
        status: "FAILED",
        error: err.message,
      });
    }
  }
);
