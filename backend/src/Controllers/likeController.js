const Dev = require('../models/devModel');

module.exports = {
    async store(req, res) {

        console.log(req.io, req.connectedUsers);

         const { devId } = req.params;
         const { user } = req.headers;

         const loggedDev = await Dev.findById(user);
         const targetDev = await Dev.findById(devId);

         if (!targetDev) {
             return res.status(400).json({ error: "Dev not exist"})
         }

         if(targetDev.likes.includes(loggedDev._id)) {
             const loggedSocket = req.connectedUsers[user];
             const targetSocket = req.connectedUsers[devId];

             if (loggedSocket) {
                 req.io.to(loggedSocket).emit('match', targetDev);
             }

             if (targetSocket) {
                 req.io.to(targetSocket).emit('match', loggedSocket);
             }
         }
         
         loggedDev.likes.push(targetDev._id);

         await loggedDev.save();

         return res.json(loggedDev);
    }
}