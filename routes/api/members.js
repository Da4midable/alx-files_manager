import express from 'express';
import members from './Members.js';
const router = express.Router();

router.get('/api/members', (req, res) => res.json(members));

router.get('/api/members/:id', (req, res) => {
  const found = members.some(member => member.id === parseInt(req.params.id));

  if (found) {
    res.json(members.filter(member => member.id === parseInt(req.params.id)));
  } else {
    res.status(400).json({msg: `No member with the id of ${parseInt(req.params.id)}`})
  }
});

module.exports = router;
