const express = require('express');
const router = express.Router();

const StatusModel = require("../models/status");

router.get('/check', (req, res, next) => {
  res.status(200).json({
    message: 'API working',
    success: true,
  });
});

router.get('/all', [], async (req, res, next) => {

  const statusData = await StatusModel.find({});
  res.status(200).json(statusData);
});

router.post('/', (req, res, next) => {  
  const { body } = req;

  const newStatus = new StatusModel({
    statusId: body?.statusId,
    statusContent: body?.statusContent
  });

  newStatus.save()
    .then(doc => {
      console.log('User saved successfully:', doc);
      // The `_id` field is automatically generated and visible here
      console.log('Auto-generated _id:', doc._id);
    })
    .catch(err => {
      console.error('Error saving user:', err);
    });

  res.status(201).json({
      status: 'success',
      message: 'status saved',
  });
});

router.post('/update', async (req, res, next) => {
  const { body } = req;
  
  const dbres = await StatusModel.updateOne({_id: body?.id}, { $set: { statusContent: body?.newStatus } });
  res.status(201).json({success: true});
});

router.post('/delete', async (req, res, next) => {
  const { body } = req;

  const dbres = await StatusModel.deleteOne({_id: body?.id});
  res.status(201).json({success: true});
});


// router.delete('/:taskId', (req, res, next) => {
//     const doDelete = Task.findByIdAndDelete(req.params.taskId);
//     doDelete.then(resp => {
//         res.status(200).json({
//             status: 'success',
//             message: 'Document deleted'
//         });
//     });
// });

module.exports = router;