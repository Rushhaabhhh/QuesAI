const express = require('express');
const router = express.Router();

const upload = require('../middleware/multer');
const Project = require('../models/projectModel');
const Podcast = require('../models/podcastModel');

const AuthMiddleware = require('../middleware/AuthMiddleware.js')

//Create a new post
router.post("/", AuthMiddleware, async (req, res) => { 
    const newProject = new Project(req.body);
    try {
        const savedProject = await newProject.save();
        res.status(200).json(savedProject);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get all projects for a specific user
router.get('/user/:userId', async (req, res) => {
    try {
        const projects = await Project.find({ userId: req.params.userId });
        res.status(200).json(projects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a project by ID (ensure it belongs to the logged-in user)
router.get('/api/projects/user/:userId', AuthMiddleware, async (req, res) => {
    try {
      const projects = await Project.find({ userId: req.params.userId });
      res.json(projects);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server error' });
    }
  });

// Add a new podcast and increment the episode count
// router.post('/:id', AuthMiddleware, upload.single('file'), async (req, res) => {
//     try {
//         const project = await Project.findOne({ _id: req.params.id, userId: req.user.id });
//         if (project) {
//             const { title, description } = req.body;
//             const fileUrl = req.file.path; 

//             const newPodcast = new Podcast({ title, description, fileUrl, projectId: project._id });
//             await newPodcast.save();

//             project.episodeCount += 1;
//             project.updatedAt = Date.now();
//             await project.save();

//             res.status(201).json({
//                 message: 'Podcast added and episode count updated',
//                 project,
//                 podcast: newPodcast
//             });
//         } else {
//             res.status(404).json({ message: 'Project not found or unauthorized' });
//         }
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

module.exports = router;