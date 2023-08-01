// import { Router } from "express";
// import { authenticateToken } from "../../../../middleware/auth.middleware.js";
// import multer from "multer";
// import { dwn } from "../../../../config/web5AndAgentExecutor.js";
// const upload = multer({ dest: "files/" });

// /**
//  * @swagger
//  * /api/v1/documents/uploadDocs:
//  *   post:
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       content:
//  *         multipart/form-data:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               files:
//  *                 type: array
//  *                 items:
//  *                   type: string
//  *                   format: binary
//  *                 required: true
//  *     responses:
//  *       200:
//  *         description: OK
//  *     tags:
//  *       - Documents
//  */
// export default Router({ mergeParams: true }).post(
//   "/v1/documents/uploadDocs",
//   authenticateToken,
//   upload.array("files"),
//   async (req, res) => {
//     try {
//       if (!req.files)
//         return res.status(400).json({
//           message: "No files provided",
//         });

//       for (const file of req.files as Express.Multer.File[]) {
//         const blob = file.buffer;

//         // Upload blob
//         const blobResult = await dwn.records.create({
//           data: blob,
//           message: {
//             dataFormat: file.mimetype,
//           },
//         });

//         const data = {
//           "@context": "https://schema.org",
//           "@type": "DigitalDocument",
//           name: file.originalname,
//           encodingFormat: file.mimetype,
//           size: file.size.toString(),
//           datePublished: new Date().toISOString(),
//           identifier: blobResult.record!.id,
//           blobRecordId: blobResult.record!.id,
//         };

//         await dwn.records.create({
//           data: data,
//           message: {
//             schema: "https://schema.org/DigitalDocument",
//           },
//         });
//       }

//       res.json({
//         message: "Uploaded files",
//       });
//     } catch (err: any) {
//       console.error(err);
//       res.status(400).json({
//         status: "FAILED",
//         error: err.message,
//       });
//     }
//   }
// );
