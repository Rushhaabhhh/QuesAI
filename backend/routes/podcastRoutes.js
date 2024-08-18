const express = require('express');
const router = express.Router();

const Podcast = require('../models/podcastModel');
const Project = require('../models/projectModel');
const AuthMiddleware = require('../middleware/AuthMiddleware');
const upload = require('../middleware/multer');

router.get('/:projectId', AuthMiddleware, async (req, res) => {
    try {
        const podcasts = await Podcast.find({ project: req.params.projectId });
        res.status(200).json(podcasts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.post('/:projectId', upload.single('file'), async (req, res) => {
    try {
        console.log('Received projectId:', req.params.projectId);
        
        const project = await Project.findById(req.params.projectId);
        
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        console.log('Found project:', project);

        const { title, description } = req.body;
        const fileUrl = req.file ? req.file.path : req.body.rssUrl; 

        console.log('Creating new podcast with data:', { title, description, fileUrl, project: project._id });

        const newPodcast = new Podcast({
            title,
            description,
            fileUrl,
            projectId: project._id
        });

        const savedPodcast = await newPodcast.save();
        console.log('Saved podcast:', savedPodcast);

        // Update project
        project.episodeCount = (project.episodeCount || 0) + 1;
        project.updatedAt = Date.now();
        await project.save();

        res.status(201).json({
            message: 'Podcast added successfully',
            podcast: savedPodcast
        });
    } catch (err) {
        console.error('Error adding podcast:', err);
        // if (err.name === 'ValidationError') {
        //     const validationErrors = Object.values(err.errors).map(error => error.message);
        //     return res.status(400).json({ message: 'Validation error', errors: validationErrors });
        // }
        res.status(500).json({ message: 'Error adding podcast', error: err.message });
    }
});

// router.post('/', async (req, res) => {

//     const { title, fileUrl, rssUrl, youtubeLink, uploadedFiles } = req.body;

//     const newPodcast = new Podcast({
//         title,
//         fileUrl,
//         rssUrl,
//         youtubeLink,
//         uploadedFiles
//     });

//     try {
//         const savedPodcast = await newPodcast.save();
//         res.status(200).json(savedPodcast);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

module.exports = router;